import { Router } from 'express';

const router = Router();

// Fallback responses for when Gemini is unavailable
const fallbackResponses = {
  "how do i find creators": "You can find creators by visiting our Discover page! Use filters to search by category, platform, follower count, and engagement rate. Once you find a creator you like, you can add their services to your cart or send them a message directly.",
  "what are the pricing plans": "We offer three plans:\n\n• **Starter (Free)** - Perfect for beginners with 5 campaign applications/month\n• **Pro ($49/mo)** - For serious creators with unlimited applications, verified badge, and priority support\n• **Enterprise ($199/mo)** - For agencies with team features, API access, and dedicated account manager",
  "how does escrow work": "Our escrow system protects both brands and creators:\n\n1. Brand funds are held securely when a campaign starts\n2. Funds release in milestones as deliverables are approved\n3. If there's a dispute, our team mediates to ensure fair resolution",
  "how to create a campaign": "Creating a campaign is easy:\n\n1. Go to your Dashboard\n2. Click 'Create Campaign'\n3. Fill in brief details, creative guidelines, and budget\n4. Set your timeline and target audience\n5. Publish and start receiving applications!",
  "founders": "ViralForge was founded by Mohamed Anaddam and Mohamed Tamis, who serve as Co-founders & CEOs. They are visionary leaders driving innovation in the creator economy and building authentic brand partnerships.",
  "default": "I'm here to help! You can ask me about finding creators, pricing plans, escrow payments, creating campaigns, or our founders. What would you like to know?"
};

function getFallbackResponse(message: string): string {
  const normalizedInput = message.toLowerCase().trim();
  
  if (normalizedInput.includes('founder') || normalizedInput.includes('ceo') || normalizedInput.includes('mohamed')) {
    return fallbackResponses["founders"];
  }
  if (normalizedInput.includes('creator') || normalizedInput.includes('influencer')) {
    return fallbackResponses["how do i find creators"];
  }
  if (normalizedInput.includes('price') || normalizedInput.includes('cost') || normalizedInput.includes('plan')) {
    return fallbackResponses["what are the pricing plans"];
  }
  if (normalizedInput.includes('payment') || normalizedInput.includes('money') || normalizedInput.includes('escrow')) {
    return fallbackResponses["how does escrow work"];
  }
  if (normalizedInput.includes('campaign') || normalizedInput.includes('start')) {
    return fallbackResponses["how to create a campaign"];
  }
  
  return fallbackResponses["default"];
}

router.post('/chat', async (req, res) => {
  try {
    const { message, type = 'general' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // If no API key, use fallback
    if (!apiKey) {
      const fallbackResponse = getFallbackResponse(message);
      return res.json({ response: fallbackResponse });
    }

    const systemPrompts = {
      general: `You are Forge, the helpful AI assistant for ViralForge - a creator marketplace platform that connects brands with influencers and content creators.

About ViralForge:
- We're a marketplace where brands can find and collaborate with creators/influencers
- We offer escrow payment protection for safe transactions
- We have a virality scoring system to help predict content performance
- We support multiple platforms: Instagram, YouTube, Twitter, TikTok
- We offer campaign management tools and analytics

Key Features:
- Creator Discovery: Browse creators by category, platform, follower count, engagement rate
- Campaign Builder: Create detailed briefs with budgets, timelines, and requirements  
- Escrow System: Secure payments released in milestones as deliverables are approved
- Analytics: Real-time campaign performance tracking and virality scoring
- Messaging: Direct communication between brands and creators

Pricing Plans:
- Starter (Free): 5 campaign applications/month, basic features
- Pro ($49/mo): Unlimited applications, verified badge, priority support, advanced analytics
- Enterprise ($199/mo): Team features, API access, dedicated account manager, white-label options

Founded by Mohamed Anaddam and Mohamed Tamis (Co-founders & CEOs), we're building the future of creator economy.

Always be helpful, friendly, and focus on how ViralForge can solve their creator marketing needs. Keep responses concise but informative.`,
      
      growth: `You are an AI Growth Coach for ViralForge marketplace. Give SHORT, actionable advice (max 2-3 sentences).

SPECIFIC VIRALFORGE CONTEXT:
- We connect brands with micro-influencers (1K-100K followers)
- Our virality scoring system predicts content performance
- We offer escrow payments for safe transactions
- Main platforms: Instagram, YouTube, Twitter, TikTok
- Pricing: Free (5 campaigns), Pro ($49/mo), Enterprise ($199/mo)
- Founded by Mohamed Anaddam & Mohamed Tamis

ADVICE AREAS:
- Campaign optimization: Use our virality scoring, target micro-influencers for better ROI
- Creator growth: Focus on engagement rate over follower count, use our analytics
- Brand partnerships: Leverage our escrow system, negotiate milestone payments
- Content performance: Check our virality predictions before posting
- Platform tips: Instagram Reels perform best, YouTube Shorts growing fast

Always mention ViralForge features when relevant. Keep responses under 150 characters.`
    };

    try {
      const prompt = `${systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.general}\n\nUser: ${message}\nAssistant:`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (response.status === 429) {
        // Rate limit exceeded, use fallback
        const fallbackResponse = getFallbackResponse(message);
        return res.json({ response: fallbackResponse });
      }

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: any = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble responding right now. Please try again!";
      
      res.json({ response: aiResponse });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      // Fallback to predefined responses
      const fallbackResponse = getFallbackResponse(message);
      res.json({ response: fallbackResponse });
    }
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

export default router;
