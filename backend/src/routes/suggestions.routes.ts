import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { rateLimiter } from '../middleware/security';
import aiService from '../services/ai.service';
import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

const router = Router();

const suggestCampaignSchema = z.object({
  industry: z.string().optional(),
  goals: z.array(z.string()).optional(),
  budget: z.number().positive().optional(),
  targetAudience: z.string().optional(),
});

const suggestCaptionSchema = z.object({
  platform: z.enum(['instagram', 'tiktok', 'twitter', 'youtube']),
  product: z.string().optional(),
  tone: z.string().optional(),
  targetAudience: z.string().optional(),
});

/**
 * @swagger
 * /api/v1/suggest/campaign:
 *   post:
 *     summary: Get AI-powered campaign suggestions
 *     tags: [AI Suggestions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               industry:
 *                 type: string
 *               goals:
 *                 type: array
 *                 items:
 *                   type: string
 *               budget:
 *                 type: number
 *               targetAudience:
 *                 type: string
 */
router.post(
  '/campaign',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(suggestCampaignSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const context = req.body;

      const suggestions = await aiService.suggestCampaign(userId, context);

      res.json({
        success: true,
        data: { suggestions },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/suggest/caption:
 *   post:
 *     summary: Get AI-powered caption suggestions for a campaign
 *     tags: [AI Suggestions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campaignId
 *               - platform
 *             properties:
 *               campaignId:
 *                 type: string
 *               platform:
 *                 type: string
 *                 enum: [instagram, tiktok, twitter, youtube]
 *               product:
 *                 type: string
 *               tone:
 *                 type: string
 *               targetAudience:
 *                 type: string
 */
router.post(
  '/caption',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(
    z.object({
      campaignId: z.string().uuid(),
      ...suggestCaptionSchema.shape,
    })
  ),
  async (req, res, next) => {
    try {
      const { campaignId, platform, ...context } = req.body;

      // Verify campaign exists and user has access
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundError('Campaign not found');
      }

      if (campaign.brandId !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw new NotFoundError('Campaign not found');
      }

      const suggestions = await aiService.suggestCaption(
        campaignId,
        platform,
        context
      );

      res.json({
        success: true,
        data: { suggestions },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/suggest/influencers:
 *   post:
 *     summary: Get AI-powered influencer/creator suggestions for a campaign
 *     tags: [AI Suggestions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campaignId
 *             properties:
 *               campaignId:
 *                 type: string
 *               limit:
 *                 type: number
 *                 default: 10
 */
router.post(
  '/influencers',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(
    z.object({
      campaignId: z.string().uuid(),
      limit: z.number().int().positive().max(50).optional().default(10),
    })
  ),
  async (req, res, next) => {
    try {
      const { campaignId, limit } = req.body;

      // Verify campaign exists and user has access
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        throw new NotFoundError('Campaign not found');
      }

      if (campaign.brandId !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw new NotFoundError('Campaign not found');
      }

      const suggestions = await aiService.suggestInfluencers(campaignId, limit);

      // Enrich with creator details
      const enrichedSuggestions = await Promise.all(
        suggestions.map(async (suggestion) => {
          const creator = await prisma.user.findUnique({
            where: { id: suggestion.creatorId },
            select: {
              id: true,
              displayName: true,
              avatar: true,
              bio: true,
              isVerified: true,
              listings: {
                where: { isActive: true },
                take: 3,
                select: {
                  id: true,
                  title: true,
                  price: true,
                  platform: true,
                },
              },
            },
          });

          return {
            ...suggestion,
            creator,
          };
        })
      );

      res.json({
        success: true,
        data: { suggestions: enrichedSuggestions },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;




