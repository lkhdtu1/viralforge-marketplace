import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import emailService from '../services/email.service';
import aiService from '../services/ai.service';

const prisma = new PrismaClient();

/**
 * Cron worker for automated workflows
 */
class CronWorker {
  private jobs: cron.ScheduledTask[] = [];

  /**
   * Start all cron jobs
   */
  start() {
    logger.info('Starting cron workers...');

    // Weekly summary email (every Monday at 9 AM)
    this.jobs.push(
      cron.schedule('0 9 * * 1', async () => {
        logger.info('Running weekly summary email job...');
        await this.sendWeeklySummaries();
      })
    );

    // Inactive user reactivation (daily at 10 AM)
    this.jobs.push(
      cron.schedule('0 10 * * *', async () => {
        logger.info('Running inactive user reactivation job...');
        await this.checkInactiveUsers();
      })
    );

    // Analytics aggregation (daily at 2 AM)
    this.jobs.push(
      cron.schedule('0 2 * * *', async () => {
        logger.info('Running analytics aggregation job...');
        await this.aggregateAnalytics();
      })
    );

    // Update creator rankings (daily at 3 AM)
    this.jobs.push(
      cron.schedule('0 3 * * *', async () => {
        logger.info('Running creator ranking update job...');
        await this.updateCreatorRankings();
      })
    );

    logger.info(`Started ${this.jobs.length} cron jobs`);
  }

  /**
   * Stop all cron jobs
   */
  stop() {
    this.jobs.forEach((job) => job.stop());
    logger.info('Stopped all cron jobs');
  }

  /**
   * Send weekly summary emails to all active users
   */
  private async sendWeeklySummaries() {
    try {
      const users = await prisma.user.findMany({
        where: {
          isActive: true,
          emailVerified: true,
        },
        include: {
          campaigns: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
          creatorContracts: {
            where: {
              status: 'COMPLETED',
              updatedAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      });

      for (const user of users) {
        try {
          const analytics = await this.getUserAnalytics(user.id, user.role);
          const suggestions = await this.generateUserSuggestions(user);

          await emailService.sendWeeklySummaryEmail(
            user.email,
            user.displayName || user.email,
            user.role,
            analytics,
            suggestions
          );
        } catch (error) {
          logger.error(`Error sending weekly summary to ${user.email}:`, error);
        }
      }

      logger.info(`Sent weekly summaries to ${users.length} users`);
    } catch (error) {
      logger.error('Error in weekly summary job:', error);
    }
  }

  /**
   * Check for inactive users and send reactivation emails
   */
  private async checkInactiveUsers() {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const inactiveUsers = await prisma.user.findMany({
        where: {
          isActive: true,
          emailVerified: true,
          OR: [
            { lastLoginAt: { lt: sevenDaysAgo } },
            { lastLoginAt: null },
          ],
        },
      });

      for (const user of inactiveUsers) {
        try {
          const recommendations = await this.generateReactivationRecommendations(
            user
          );

          await emailService.sendReactivationEmail(
            user.email,
            user.displayName || user.email,
            recommendations
          );
        } catch (error) {
          logger.error(
            `Error sending reactivation email to ${user.email}:`,
            error
          );
        }
      }

      logger.info(`Sent reactivation emails to ${inactiveUsers.length} users`);
    } catch (error) {
      logger.error('Error in inactive user check job:', error);
    }
  }

  /**
   * Aggregate analytics data
   */
  private async aggregateAnalytics() {
    try {
      // Aggregate campaign performance
      const campaigns = await prisma.campaign.findMany({
        where: {
          status: 'ACTIVE',
        },
        include: {
          analyticsEvents: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      });

      for (const campaign of campaigns) {
        const events = campaign.analyticsEvents;
        const views = events.filter((e) => e.eventType === 'VIEW').length;
        const engagements = events.filter(
          (e) => e.eventType === 'ENGAGEMENT'
        ).length;
        const shares = events.filter((e) => e.eventType === 'SHARE').length;

        // Update campaign metrics (if you have a metrics table)
        // await prisma.campaignMetrics.upsert({...})
      }

      logger.info(`Aggregated analytics for ${campaigns.length} campaigns`);
    } catch (error) {
      logger.error('Error in analytics aggregation job:', error);
    }
  }

  /**
   * Update creator rankings based on performance
   */
  private async updateCreatorRankings() {
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
      });

      for (const creator of creators) {
        const score = this.calculateCreatorScore(creator);

        // Update creator score (if you have a score field)
        // await prisma.user.update({
        //   where: { id: creator.id },
        //   data: { creatorScore: score }
        // });
      }

      logger.info(`Updated rankings for ${creators.length} creators`);
    } catch (error) {
      logger.error('Error in creator ranking update job:', error);
    }
  }

  /**
   * Get user analytics for weekly summary
   */
  private async getUserAnalytics(
    userId: string,
    role: string
  ): Promise<any> {
    if (role === 'BRAND') {
      const campaigns = await prisma.campaign.findMany({
        where: { brandId: userId },
      });

      const contracts = await prisma.contract.findMany({
        where: {
          brandId: userId,
          status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
        },
      });

      const totalSpent = await prisma.transaction.aggregate({
        where: {
          userId,
          type: 'PAYMENT',
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      });

      return {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c) => c.status === 'ACTIVE').length,
        totalSpent: totalSpent._sum.amount || 0,
        activeContracts: contracts.length,
      };
    } else {
      const contracts = await prisma.contract.findMany({
        where: {
          creatorId: userId,
          status: 'COMPLETED',
        },
      });

      const totalEarnings = await prisma.transaction.aggregate({
        where: {
          userId,
          type: 'PAYOUT',
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      });

      const activeContracts = await prisma.contract.findMany({
        where: {
          creatorId: userId,
          status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
        },
      });

      // Get analytics events for creator content
      const events = await prisma.analyticsEvent.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      return {
        totalEarnings: totalEarnings._sum.amount || 0,
        activeContracts: activeContracts.length,
        views: events.filter((e) => e.eventType === 'VIEW').length,
        engagements: events.filter((e) => e.eventType === 'ENGAGEMENT').length,
      };
    }
  }

  /**
   * Generate personalized suggestions for user
   */
  private async generateUserSuggestions(user: any): Promise<string[]> {
    const suggestions: string[] = [];

    if (user.role === 'BRAND') {
      const activeCampaigns = await prisma.campaign.count({
        where: {
          brandId: user.id,
          status: 'ACTIVE',
        },
      });

      if (activeCampaigns === 0) {
        suggestions.push(
          'Create your first campaign to start connecting with creators!'
        );
      } else if (activeCampaigns < 3) {
        suggestions.push(
          'Consider launching multiple campaigns to maximize your reach.'
        );
      }

      const recentCampaigns = await prisma.campaign.findMany({
        where: {
          brandId: user.id,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        take: 1,
      });

      if (recentCampaigns.length > 0) {
        suggestions.push(
          `Your recent campaign "${recentCampaigns[0].title}" is performing well. Consider similar campaigns.`
        );
      }
    } else {
      const activeListings = await prisma.listing.count({
        where: {
          creatorId: user.id,
          isActive: true,
        },
      });

      if (activeListings === 0) {
        suggestions.push(
          'Create service listings to start receiving campaign offers!'
        );
      } else if (activeListings < 3) {
        suggestions.push(
          'Add more service listings to increase your visibility.'
        );
      }

      const availableCampaigns = await prisma.campaign.count({
        where: {
          status: 'ACTIVE',
        },
      });

      if (availableCampaigns > 0) {
        suggestions.push(
          `There are ${availableCampaigns} active campaigns you can apply to!`
        );
      }
    }

    return suggestions;
  }

  /**
   * Generate reactivation recommendations
   */
  private async generateReactivationRecommendations(
    user: any
  ): Promise<string[]> {
    const recommendations: string[] = [];

    if (user.role === 'BRAND') {
      recommendations.push(
        'New creators have joined the platform - perfect time to launch a campaign!'
      );
      recommendations.push(
        'Check out trending campaign ideas in your industry.'
      );
    } else {
      recommendations.push(
        'New campaigns are available that match your expertise!'
      );
      recommendations.push(
        'Update your profile to get featured in creator searches.'
      );
    }

    return recommendations;
  }

  /**
   * Calculate creator score for ranking
   */
  private calculateCreatorScore(creator: any): number {
    let score = 0;

    // Completion rate
    const totalContracts = creator.creatorContracts.length;
    if (totalContracts > 0) {
      const completed = creator.creatorContracts.filter(
        (c: any) => c.status === 'COMPLETED'
      ).length;
      score += (completed / totalContracts) * 40;
    }

    // Active listings
    score += Math.min(creator.listings.length * 10, 30);

    // Verification
    if (creator.isVerified) {
      score += 20;
    }

    // Account age (longer = more trusted)
    const accountAge = Date.now() - new Date(creator.createdAt).getTime();
    const daysOld = accountAge / (1000 * 60 * 60 * 24);
    score += Math.min(daysOld / 30, 10); // Max 10 points for 30+ days

    return Math.min(score, 100);
  }
}

export default new CronWorker();



