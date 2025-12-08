import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserLevel {
  level: number;
  xp: number;
  xpToNext: number;
  title: string;
  badges: Badge[];
  rank: number;
}

/**
 * Gamification service for badges, levels, and rankings
 */
class GamificationService {
  private readonly XP_PER_ACTION: Record<string, number> = {
    CAMPAIGN_CREATED: 100,
    CAMPAIGN_COMPLETED: 200,
    CONTRACT_ACCEPTED: 50,
    CONTRACT_COMPLETED: 150,
    LISTING_CREATED: 30,
    MESSAGE_SENT: 5,
    PROFILE_COMPLETED: 25,
    FIRST_CAMPAIGN: 500,
    FIRST_CONTRACT: 300,
    VERIFIED: 200,
  };

  private readonly BADGES: Badge[] = [
    {
      id: 'first-campaign',
      name: 'First Campaign',
      description: 'Created your first campaign',
      icon: '🎯',
      category: 'milestone',
      rarity: 'common',
    },
    {
      id: 'campaign-master',
      name: 'Campaign Master',
      description: 'Created 10 campaigns',
      icon: '👑',
      category: 'achievement',
      rarity: 'epic',
    },
    {
      id: 'top-creator',
      name: 'Top Creator',
      description: 'Ranked in top 10 creators',
      icon: '⭐',
      category: 'special',
      rarity: 'legendary',
    },
    {
      id: 'verified',
      name: 'Verified',
      description: 'Account verified',
      icon: '✓',
      category: 'special',
      rarity: 'rare',
    },
    {
      id: 'first-contract',
      name: 'First Contract',
      description: 'Completed your first contract',
      icon: '🤝',
      category: 'milestone',
      rarity: 'common',
    },
    {
      id: 'earnings-milestone',
      name: 'Earnings Milestone',
      description: 'Earned $10,000',
      icon: '💰',
      category: 'achievement',
      rarity: 'epic',
    },
  ];

  /**
   * Award XP to user
   */
  async awardXP(userId: string, action: string, metadata?: any): Promise<void> {
    try {
      const xpAmount = this.XP_PER_ACTION[action] || 10;

      // Get or create user XP record (you'd need to add this to schema)
      // For now, we'll log it
      logger.info(`Awarding ${xpAmount} XP to user ${userId} for ${action}`);

      // Check for level ups and badge unlocks
      await this.checkLevelUp(userId, xpAmount);
      await this.checkBadgeUnlocks(userId, action, metadata);
    } catch (error) {
      logger.error('Error awarding XP:', error);
    }
  }

  /**
   * Get user level and progress
   */
  async getUserLevel(userId: string): Promise<UserLevel> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          campaigns: true,
          creatorContracts: true,
          listings: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate XP based on activities
      const xp = this.calculateUserXP(user);
      const level = this.xpToLevel(xp);
      const xpToNext = this.xpForLevel(level + 1) - xp;
      const title = this.getLevelTitle(level, user.role);
      const badges = await this.getUserBadges(userId);
      const rank = await this.getUserRank(userId, user.role);

      return {
        level,
        xp,
        xpToNext,
        title,
        badges,
        rank,
      };
    } catch (error) {
      logger.error('Error getting user level:', error);
      return {
        level: 1,
        xp: 0,
        xpToNext: 100,
        title: 'Newcomer',
        badges: [],
        rank: 0,
      };
    }
  }

  /**
   * Get top creators ranking
   */
  async getTopCreators(limit: number = 10): Promise<any[]> {
    try {
      const creators = await prisma.user.findMany({
        where: {
          role: 'CREATOR',
          isActive: true,
        },
        include: {
          creatorContracts: {
            where: { status: 'COMPLETED' },
          },
          listings: {
            where: { isActive: true },
          },
        },
        take: limit * 2, // Get more to calculate scores
      });

      const scored = creators.map((creator) => ({
        ...creator,
        score: this.calculateCreatorScore(creator),
      }));

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((creator, index) => ({
          ...creator,
          rank: index + 1,
        }));
    } catch (error) {
      logger.error('Error getting top creators:', error);
      return [];
    }
  }

  /**
   * Get top brands ranking
   */
  async getTopBrands(limit: number = 10): Promise<any[]> {
    try {
      const brands = await prisma.user.findMany({
        where: {
          role: 'BRAND',
          isActive: true,
        },
        include: {
          campaigns: true,
          contracts: true,
        },
        take: limit * 2,
      });

      const scored = brands.map((brand) => ({
        ...brand,
        score: this.calculateBrandScore(brand),
      }));

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((brand, index) => ({
          ...brand,
          rank: index + 1,
        }));
    } catch (error) {
      logger.error('Error getting top brands:', error);
      return [];
    }
  }

  /**
   * Calculate user XP from activities
   */
  private calculateUserXP(user: any): number {
    let xp = 0;

    // Campaigns
    xp += user.campaigns.length * this.XP_PER_ACTION.CAMPAIGN_CREATED;
    xp += user.campaigns.filter((c: any) => c.status === 'COMPLETED').length * this.XP_PER_ACTION.CAMPAIGN_COMPLETED;

    // Contracts (for creators)
    if (user.role === 'CREATOR') {
      xp += user.creatorContracts.length * this.XP_PER_ACTION.CONTRACT_ACCEPTED;
      xp += user.creatorContracts.filter((c: any) => c.status === 'COMPLETED').length * this.XP_PER_ACTION.CONTRACT_COMPLETED;
    }

    // Listings
    xp += user.listings.length * this.XP_PER_ACTION.LISTING_CREATED;

    // Verification
    if (user.isVerified) {
      xp += this.XP_PER_ACTION.VERIFIED;
    }

    // First campaign/contract bonuses
    if (user.campaigns.length === 1) {
      xp += this.XP_PER_ACTION.FIRST_CAMPAIGN;
    }
    if (user.creatorContracts.length === 1) {
      xp += this.XP_PER_ACTION.FIRST_CONTRACT;
    }

    return xp;
  }

  /**
   * Convert XP to level
   */
  private xpToLevel(xp: number): number {
    let level = 1;
    let xpNeeded = 0;

    while (xpNeeded <= xp) {
      level++;
      xpNeeded += this.xpForLevel(level);
    }

    return level - 1;
  }

  /**
   * Get XP required for a level
   */
  private xpForLevel(level: number): number {
    // Exponential growth: 100 * level^1.5
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  /**
   * Get level title
   */
  private getLevelTitle(level: number, role: string): string {
    const titles = {
      CREATOR: [
        'Newcomer',
        'Rising Star',
        'Content Creator',
        'Influencer',
        'Viral Sensation',
        'Platform Legend',
      ],
      BRAND: [
        'Newcomer',
        'Marketer',
        'Campaign Manager',
        'Brand Strategist',
        'Marketing Master',
        'Platform Legend',
      ],
    };

    const roleTitles = titles[role as keyof typeof titles] || titles.CREATOR;
    const index = Math.min(Math.floor(level / 5), roleTitles.length - 1);
    return roleTitles[index];
  }

  /**
   * Get user badges
   */
  private async getUserBadges(userId: string): Promise<Badge[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        campaigns: true,
        creatorContracts: true,
        listings: true,
      },
    });

    if (!user) return [];

    const badges: Badge[] = [];

    // First campaign
    if (user.campaigns.length >= 1) {
      badges.push(this.BADGES.find((b) => b.id === 'first-campaign')!);
    }

    // Campaign master
    if (user.campaigns.length >= 10) {
      badges.push(this.BADGES.find((b) => b.id === 'campaign-master')!);
    }

    // First contract
    if (user.creatorContracts.length >= 1) {
      badges.push(this.BADGES.find((b) => b.id === 'first-contract')!);
    }

    // Verified
    if (user.isVerified) {
      badges.push(this.BADGES.find((b) => b.id === 'verified')!);
    }

    return badges.filter(Boolean);
  }

  /**
   * Get user rank
   */
  private async getUserRank(userId: string, role: string): Promise<number> {
    const topUsers = role === 'CREATOR' 
      ? await this.getTopCreators(100)
      : await this.getTopBrands(100);

    const userIndex = topUsers.findIndex((u) => u.id === userId);
    return userIndex >= 0 ? userIndex + 1 : 0;
  }

  /**
   * Calculate creator score for ranking
   */
  private calculateCreatorScore(creator: any): number {
    let score = 0;

    // Completed contracts
    const completed = creator.creatorContracts.filter((c: any) => c.status === 'COMPLETED').length;
    score += completed * 10;

    // Active listings
    score += creator.listings.length * 5;

    // Verification
    if (creator.isVerified) {
      score += 50;
    }

    return score;
  }

  /**
   * Calculate brand score for ranking
   */
  private calculateBrandScore(brand: any): number {
    let score = 0;

    // Campaigns
    score += brand.campaigns.length * 5;
    score += brand.campaigns.filter((c: any) => c.status === 'COMPLETED').length * 20;

    // Contracts
    score += brand.contracts.length * 3;

    return score;
  }

  /**
   * Check for level up
   */
  private async checkLevelUp(userId: string, xpGained: number): Promise<void> {
    // Implementation would check if user leveled up and notify
    logger.info(`Checking level up for user ${userId} (+${xpGained} XP)`);
  }

  /**
   * Check for badge unlocks
   */
  private async checkBadgeUnlocks(userId: string, action: string, metadata?: any): Promise<void> {
    // Implementation would check if user unlocked any badges
    logger.info(`Checking badge unlocks for user ${userId} (action: ${action})`);
  }
}

export default new GamificationService();



