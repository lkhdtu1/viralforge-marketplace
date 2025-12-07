import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

interface AISuggestion {
  suggestion: string;
  reasoning: string;
  confidence: number;
  actionable: boolean;
}

interface CampaignSuggestion {
  title: string;
  description: string;
  targetAudience: string[];
  suggestedBudget: number;
  platforms: string[];
  hashtags: string[];
  reasoning: string;
}

interface CaptionSuggestion {
  caption: string;
  hashtags: string[];
  callToAction: string;
  tone: 'professional' | 'casual' | 'humorous' | 'inspirational';
  reasoning: string;
}

interface InfluencerSuggestion {
  creatorId: string;
  matchScore: number;
  reasons: string[];
  estimatedReach: number;
  estimatedEngagement: number;
}

class AIService {
  private openaiApiKey: string | undefined;
  private useLocalLLM: boolean;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.useLocalLLM = process.env.USE_LOCAL_LLM === 'true';
  }

  /**
   * Generate campaign suggestions using AI
   */
  async suggestCampaign(
    brandId: string,
    context?: {
      industry?: string;
      goals?: string[];
      budget?: number;
      targetAudience?: string;
    }
  ): Promise<CampaignSuggestion[]> {
    try {
      // Get brand's previous campaigns for context
      const previousCampaigns = await prisma.campaign.findMany({
        where: { brandId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          title: true,
          description: true,
          budget: true,
          status: true,
        },
      });

      const prompt = this.buildCampaignPrompt(context, previousCampaigns);
      const suggestions = await this.callAI(prompt, 'campaign');

      return this.parseCampaignSuggestions(suggestions);
    } catch (error) {
      logger.error('Error generating campaign suggestions:', error);
      // Fallback to rule-based suggestions
      return this.getFallbackCampaignSuggestions(context);
    }
  }

  /**
   * Generate caption suggestions for social media posts
   */
  async suggestCaption(
    campaignId: string,
    platform: 'instagram' | 'tiktok' | 'twitter' | 'youtube',
    context?: {
      product?: string;
      brand?: string;
      tone?: string;
      targetAudience?: string;
    }
  ): Promise<CaptionSuggestion[]> {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { brand: true },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const prompt = this.buildCaptionPrompt(campaign, platform, context);
      const suggestions = await this.callAI(prompt, 'caption');

      return this.parseCaptionSuggestions(suggestions);
    } catch (error) {
      logger.error('Error generating caption suggestions:', error);
      return this.getFallbackCaptionSuggestions(platform, context);
    }
  }

  /**
   * Suggest influencers/creators for a campaign
   */
  async suggestInfluencers(
    campaignId: string,
    limit: number = 10
  ): Promise<InfluencerSuggestion[]> {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { brand: true },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Get all creators with listings
      const creators = await prisma.user.findMany({
        where: {
          role: 'CREATOR',
          isActive: true,
          listings: {
            some: {
              isActive: true,
            },
          },
        },
        include: {
          listings: {
            where: { isActive: true },
            take: 5,
          },
          creatorContracts: {
            where: { status: 'COMPLETED' },
            take: 10,
          },
        },
        take: 100, // Limit for performance
      });

      // Score creators based on campaign requirements
      const scoredCreators = await Promise.all(
        creators.map(async (creator) => {
          const score = await this.scoreCreatorMatch(campaign, creator);
          return {
            creatorId: creator.id,
            matchScore: score.total,
            reasons: score.reasons,
            estimatedReach: score.estimatedReach,
            estimatedEngagement: score.estimatedEngagement,
          };
        })
      );

      // Sort by match score and return top matches
      return scoredCreators
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit)
        .filter((c) => c.matchScore > 0.3); // Only return good matches
    } catch (error) {
      logger.error('Error suggesting influencers:', error);
      return [];
    }
  }

  /**
   * Score how well a creator matches a campaign
   */
  private async scoreCreatorMatch(
    campaign: any,
    creator: any
  ): Promise<{
    total: number;
    reasons: string[];
    estimatedReach: number;
    estimatedEngagement: number;
  }> {
    const reasons: string[] = [];
    let score = 0;
    let estimatedReach = 0;
    let estimatedEngagement = 0;

    // Check listings match
    if (creator.listings && creator.listings.length > 0) {
      const avgPrice = creator.listings.reduce(
        (sum: number, l: any) => sum + l.price,
        0
      ) / creator.listings.length;

      if (avgPrice <= campaign.budget * 1.2) {
        score += 0.3;
        reasons.push('Price range matches campaign budget');
      }

      // Estimate reach and engagement from listings
      estimatedReach = creator.listings.reduce(
        (sum: number, l: any) => sum + (l.reach || 0),
        0
      ) / creator.listings.length;

      estimatedEngagement = creator.listings.reduce(
        (sum: number, l: any) => sum + (l.engagement || 0),
        0
      ) / creator.listings.length;
    }

    // Check completion rate
    const completedContracts = creator.creatorContracts.filter(
      (c: any) => c.status === 'COMPLETED'
    ).length;
    const totalContracts = creator.creatorContracts.length;

    if (totalContracts > 0) {
      const completionRate = completedContracts / totalContracts;
      if (completionRate >= 0.8) {
        score += 0.2;
        reasons.push('High completion rate');
      }
    }

    // Check if verified
    if (creator.isVerified) {
      score += 0.1;
      reasons.push('Verified creator');
    }

    // Check activity (has recent listings)
    if (creator.listings && creator.listings.length > 0) {
      score += 0.2;
      reasons.push('Active creator with available services');
    }

    // Check bio relevance (simple keyword matching)
    if (creator.bio && campaign.description) {
      const bioLower = creator.bio.toLowerCase();
      const descLower = campaign.description.toLowerCase();
      const commonWords = this.findCommonWords(bioLower, descLower);
      if (commonWords.length > 0) {
        score += 0.2 * Math.min(commonWords.length / 5, 1);
        reasons.push(`Bio matches campaign theme (${commonWords.slice(0, 3).join(', ')})`);
      }
    }

    return {
      total: Math.min(score, 1.0),
      reasons,
      estimatedReach,
      estimatedEngagement,
    };
  }

  /**
   * Call AI service (OpenAI or local LLM)
   */
  private async callAI(
    prompt: string,
    type: 'campaign' | 'caption'
  ): Promise<string> {
    if (this.useLocalLLM) {
      return this.callLocalLLM(prompt, type);
    } else if (this.openaiApiKey) {
      return this.callOpenAI(prompt, type);
    } else {
      // Fallback to rule-based
      logger.warn('No AI service configured, using fallback');
      return '';
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(
    prompt: string,
    type: 'campaign' | 'caption'
  ): Promise<string> {
    try {
      // Try dynamic import, but fallback if openai package is not installed
      let OpenAI;
      try {
        const openaiModule = await import('openai');
        OpenAI = openaiModule.default || openaiModule.OpenAI;
      } catch (importError) {
        logger.warn('OpenAI package not installed, using fallback');
        return '';
      }
      
      const openai = new OpenAI({
        apiKey: this.openaiApiKey,
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a marketing expert helping brands create viral campaigns and engaging social media content. 
            Provide practical, actionable suggestions in JSON format.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('OpenAI API error:', error);
      // Return empty string to trigger fallback
      return '';
    }
  }

  /**
   * Call local LLM (Ollama, etc.)
   */
  private async callLocalLLM(
    prompt: string,
    type: 'campaign' | 'caption'
  ): Promise<string> {
    try {
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
      const model = process.env.OLLAMA_MODEL || 'llama2';

      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
        }),
      });

      const data = await response.json();
      return data.response || '';
    } catch (error) {
      logger.error('Local LLM error:', error);
      throw error;
    }
  }

  /**
   * Build prompt for campaign suggestions
   */
  private buildCampaignPrompt(
    context?: any,
    previousCampaigns?: any[]
  ): string {
    let prompt = `Generate 3 campaign suggestions for a brand. `;

    if (context?.industry) {
      prompt += `Industry: ${context.industry}. `;
    }
    if (context?.goals) {
      prompt += `Goals: ${context.goals.join(', ')}. `;
    }
    if (context?.budget) {
      prompt += `Budget: $${context.budget}. `;
    }
    if (context?.targetAudience) {
      prompt += `Target Audience: ${context.targetAudience}. `;
    }

    if (previousCampaigns && previousCampaigns.length > 0) {
      prompt += `\nPrevious campaigns:\n${previousCampaigns
        .map((c) => `- ${c.title}: ${c.description}`)
        .join('\n')}`;
    }

    prompt += `\n\nProvide suggestions in JSON format:
    [
      {
        "title": "Campaign title",
        "description": "Campaign description",
        "targetAudience": ["audience1", "audience2"],
        "suggestedBudget": 5000,
        "platforms": ["instagram", "tiktok"],
        "hashtags": ["#hashtag1", "#hashtag2"],
        "reasoning": "Why this campaign would work"
      }
    ]`;

    return prompt;
  }

  /**
   * Build prompt for caption suggestions
   */
  private buildCaptionPrompt(
    campaign: any,
    platform: string,
    context?: any
  ): string {
    let prompt = `Generate 3 engaging social media captions for ${platform}.\n\n`;
    prompt += `Campaign: ${campaign.title}\n`;
    prompt += `Description: ${campaign.description}\n`;
    prompt += `Brand: ${campaign.brand?.displayName || 'Unknown'}\n`;

    if (context?.tone) {
      prompt += `Tone: ${context.tone}\n`;
    }
    if (context?.product) {
      prompt += `Product: ${context.product}\n`;
    }

    prompt += `\nProvide suggestions in JSON format:
    [
      {
        "caption": "Full caption text",
        "hashtags": ["#hashtag1", "#hashtag2"],
        "callToAction": "CTA text",
        "tone": "professional|casual|humorous|inspirational",
        "reasoning": "Why this caption would perform well"
      }
    ]`;

    return prompt;
  }

  /**
   * Parse AI response for campaign suggestions
   */
  private parseCampaignSuggestions(response: string): CampaignSuggestion[] {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      logger.error('Error parsing campaign suggestions:', error);
      return [];
    }
  }

  /**
   * Parse AI response for caption suggestions
   */
  private parseCaptionSuggestions(response: string): CaptionSuggestion[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      logger.error('Error parsing caption suggestions:', error);
      return [];
    }
  }

  /**
   * Fallback campaign suggestions (rule-based)
   */
  private getFallbackCampaignSuggestions(context?: any): CampaignSuggestion[] {
    return [
      {
        title: 'Product Launch Campaign',
        description: 'Create buzz around your new product with influencer partnerships',
        targetAudience: ['18-34', 'tech-savvy', 'early adopters'],
        suggestedBudget: context?.budget || 5000,
        platforms: ['instagram', 'tiktok'],
        hashtags: ['#newproduct', '#launch', '#innovation'],
        reasoning: 'Product launches benefit from multi-platform exposure and early adopter engagement',
      },
      {
        title: 'Brand Awareness Campaign',
        description: 'Increase brand visibility and reach new audiences',
        targetAudience: ['25-45', 'professionals', 'lifestyle'],
        suggestedBudget: context?.budget || 5000,
        platforms: ['instagram', 'youtube'],
        hashtags: ['#brand', '#lifestyle', '#quality'],
        reasoning: 'Brand awareness campaigns work best with consistent messaging across platforms',
      },
    ];
  }

  /**
   * Fallback caption suggestions
   */
  private getFallbackCaptionSuggestions(
    platform: string,
    context?: any
  ): CaptionSuggestion[] {
    const templates = {
      instagram: [
        {
          caption: 'Excited to share something special with you! ✨',
          hashtags: ['#new', '#excited', '#special'],
          callToAction: 'Check out the link in bio!',
          tone: 'casual' as const,
          reasoning: 'Engaging and friendly tone works well on Instagram',
        },
      ],
      tiktok: [
        {
          caption: 'POV: You discover something amazing 🎯',
          hashtags: ['#pov', '#discover', '#amazing'],
          callToAction: 'Follow for more!',
          tone: 'casual' as const,
          reasoning: 'TikTok captions should be short and engaging',
        },
      ],
    };

    return templates[platform as keyof typeof templates] || templates.instagram;
  }

  /**
   * Find common words between two strings
   */
  private findCommonWords(str1: string, str2: string): string[] {
    const words1 = str1.split(/\s+/).filter((w) => w.length > 3);
    const words2 = str2.split(/\s+/).filter((w) => w.length > 3);
    return words1.filter((w) => words2.includes(w));
  }
}

export default new AIService();

