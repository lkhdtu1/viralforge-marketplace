import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { pagination, paginatedResponse } from '../middleware/pagination';
import { UserRole, ListingStatus } from '@prisma/client';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { rateLimiter } from '../middleware/security';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Marketplace
 *   description: Creator marketplace endpoints
 */

// Get all creators (discovery)
router.get('/creators', pagination, async (req, res, next) => {
  try {
    const paginationParams = req.pagination!;
    const { search, verified, minFollowers, platform } = req.query;

    const where: any = {
      role: UserRole.CREATOR,
      isActive: true,
    };

    if (verified === 'true') {
      where.isVerified = true;
    }

    if (search) {
      where.OR = [
        { displayName: { contains: search as string, mode: 'insensitive' } },
        { bio: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [creators, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: paginationParams.skip,
        take: paginationParams.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          displayName: true,
          avatar: true,
          bio: true,
          isVerified: true,
          socialLinks: true,
          createdAt: true,
          listings: {
            where: { status: ListingStatus.ACTIVE },
            take: 3,
            select: {
              id: true,
              title: true,
              price: true,
              platform: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json(paginatedResponse(creators, total, paginationParams));
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/marketplace:
 *   get:
 *     summary: Browse creator listings
 *     tags: [Marketplace]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of listings
 */

// Validation schemas
const createListingSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    price: z.number().positive(),
    currency: z.string().length(3).default('USD'),
    deliverables: z.string().max(2000).optional(),
    platform: z.array(z.string()).min(1),
    reach: z.number().int().positive().optional(),
    engagement: z.number().min(0).max(100).optional(),
    campaignId: z.string().uuid().optional(),
  }),
});

const updateListingSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).max(5000).optional(),
    price: z.number().positive().optional(),
    currency: z.string().length(3).optional(),
    deliverables: z.string().max(2000).optional(),
    platform: z.array(z.string()).optional(),
    reach: z.number().int().positive().optional(),
    engagement: z.number().min(0).max(100).optional(),
    status: z.nativeEnum(ListingStatus).optional(),
    featured: z.boolean().optional(),
  }),
});

// Create listing (creator only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.CREATOR, UserRole.ADMIN),
  rateLimiter,
  sanitizeInput,
  validate(createListingSchema),
  async (req, res, next) => {
    try {
      const creatorId = req.user!.id;
      const listingData = req.body;
      
      // Verify campaign exists if provided
      if (listingData.campaignId) {
        const campaign = await prisma.campaign.findUnique({
          where: { id: listingData.campaignId },
        });
        if (!campaign) {
          throw new NotFoundError('Campaign not found');
        }
      }
      
      const listing = await prisma.listing.create({
        data: {
          ...listingData,
          creatorId,
        },
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
        },
      });
      
      res.status(201).json({
        success: true,
        data: { listing },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all listings (marketplace browse)
router.get('/', pagination, optionalAuth, async (req, res, next) => {
  try {
    const paginationParams = req.pagination!;
    const { status, creatorId, campaignId, platform, minPrice, maxPrice, search, featured } = req.query;
    
    const where: any = {
      status: status ? (status as ListingStatus) : ListingStatus.ACTIVE,
    };
    
    if (creatorId) {
      where.creatorId = creatorId as string;
    }
    
    if (campaignId) {
      where.campaignId = campaignId as string;
    }
    
    if (platform) {
      where.platform = { has: platform as string };
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice as string);
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice as string);
      }
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip: paginationParams.skip,
        take: paginationParams.limit,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
          campaign: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);
    
    res.json(paginatedResponse(listings, total, paginationParams));
  } catch (error) {
    next(error);
  }
});

// Get listing by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            bio: true,
            website: true,
            socialLinks: true,
            isVerified: true,
          },
        },
        campaign: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });
    
    if (!listing) {
      throw new NotFoundError('Listing not found');
    }
    
    res.json({
      success: true,
      data: { listing },
    });
  } catch (error) {
    next(error);
  }
});

// Update listing (creator owner or admin)
router.put(
  '/:id',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(updateListingSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      const listing = await prisma.listing.findUnique({
        where: { id },
      });
      
      if (!listing) {
        throw new NotFoundError('Listing not found');
      }
      
      // Check authorization
      if (listing.creatorId !== userId && req.user!.role !== UserRole.ADMIN) {
        throw new AuthorizationError('Not authorized to update this listing');
      }
      
      const updated = await prisma.listing.update({
        where: { id },
        data: req.body,
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
            },
          },
        },
      });
      
      res.json({
        success: true,
        data: { listing: updated },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete listing (creator owner or admin)
router.delete(
  '/:id',
  authenticate,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      const listing = await prisma.listing.findUnique({
        where: { id },
      });
      
      if (!listing) {
        throw new NotFoundError('Listing not found');
      }
      
      // Check authorization
      if (listing.creatorId !== userId && req.user!.role !== UserRole.ADMIN) {
        throw new AuthorizationError('Not authorized to delete this listing');
      }
      
      await prisma.listing.delete({
        where: { id },
      });
      
      res.json({
        success: true,
        message: 'Listing deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

