import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, authorize } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { pagination, paginatedResponse } from '../middleware/pagination';
import { UserRole, CampaignStatus } from '@prisma/client';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { rateLimiter } from '../middleware/security';

const router = Router();

/**
 * @swagger
 * /api/v1/campaigns:
 *   post:
 *     summary: Create a new campaign (Brand only)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - budget
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               budget:
 *                 type: number
 *               requirements:
 *                 type: string
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Campaign created
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaigns]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, ACTIVE, PAUSED, COMPLETED, CANCELLED]
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of campaigns
 */

/**
 * @swagger
 * /api/v1/campaigns/{id}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign details
 *       404:
 *         description: Campaign not found
 *   put:
 *     summary: Update campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, ACTIVE, PAUSED, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Campaign updated
 *   delete:
 *     summary: Delete campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Campaign deleted
 */

// Validation schemas
const createCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    budget: z.number().positive(),
    currency: z.string().length(3).default('USD'),
    requirements: z.string().max(2000).optional(),
    targetAudience: z.object({
      ageRange: z.array(z.number()).optional(),
      interests: z.array(z.string()).optional(),
      demographics: z.record(z.any()).optional(),
    }).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

const updateCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).max(5000).optional(),
    budget: z.number().positive().optional(),
    currency: z.string().length(3).optional(),
    requirements: z.string().max(2000).optional(),
    targetAudience: z.object({
      ageRange: z.array(z.number()).optional(),
      interests: z.array(z.string()).optional(),
      demographics: z.record(z.any()).optional(),
    }).optional(),
    status: z.nativeEnum(CampaignStatus).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

// Create campaign (brand only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.BRAND, UserRole.ADMIN),
  rateLimiter,
  sanitizeInput,
  validate(createCampaignSchema),
  async (req, res, next) => {
    try {
      const brandId = req.user!.id;
      const campaignData = req.body;
      
      const campaign = await prisma.campaign.create({
        data: {
          ...campaignData,
          brandId,
          status: CampaignStatus.ACTIVE,
          startDate: campaignData.startDate ? new Date(campaignData.startDate) : undefined,
          endDate: campaignData.endDate ? new Date(campaignData.endDate) : undefined,
        },
      });
      
      res.status(201).json({
        success: true,
        data: { campaign },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all campaigns (public, with filters)
router.get('/', pagination, async (req, res, next) => {
  try {
    const paginationParams = req.pagination!;
    const { status, brandId, search } = req.query;
    
    const where: any = {};
    
    if (status) {
      where.status = status as CampaignStatus;
    }
    
    if (brandId) {
      where.brandId = brandId as string;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip: paginationParams.skip,
        take: paginationParams.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);
    
    res.json(paginatedResponse(campaigns, total, paginationParams));
  } catch (error) {
    next(error);
  }
});

// Get campaign by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            isVerified: true,
            bio: true,
          },
        },
        listings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        contracts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }
    
    res.json({
      success: true,
      data: { campaign },
    });
  } catch (error) {
    next(error);
  }
});

// Update campaign (brand owner or admin)
router.put(
  '/:id',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(updateCampaignSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      const campaign = await prisma.campaign.findUnique({
        where: { id },
      });
      
      if (!campaign) {
        throw new NotFoundError('Campaign not found');
      }
      
      // Check authorization
      if (campaign.brandId !== userId && req.user!.role !== UserRole.ADMIN) {
        throw new AuthorizationError('Not authorized to update this campaign');
      }
      
      const updateData = req.body;
      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }
      
      const updated = await prisma.campaign.update({
        where: { id },
        data: updateData,
      });
      
      res.json({
        success: true,
        data: { campaign: updated },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete campaign (brand owner or admin)
router.delete(
  '/:id',
  authenticate,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      const campaign = await prisma.campaign.findUnique({
        where: { id },
      });
      
      if (!campaign) {
        throw new NotFoundError('Campaign not found');
      }
      
      // Check authorization
      if (campaign.brandId !== userId && req.user!.role !== UserRole.ADMIN) {
        throw new AuthorizationError('Not authorized to delete this campaign');
      }
      
      // Only allow deletion if no active contracts
      const activeContracts = await prisma.contract.count({
        where: {
          campaignId: id,
          status: { not: 'CANCELLED' },
        },
      });
      
      if (activeContracts > 0) {
        throw new AuthorizationError('Cannot delete campaign with active contracts');
      }
      
      await prisma.campaign.delete({
        where: { id },
      });
      
      res.json({
        success: true,
        message: 'Campaign deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

