import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { pagination, paginatedResponse } from '../middleware/pagination';
import { UserRole, ListingStatus } from '@prisma/client';
import { NotFoundError, AuthorizationError } from '../utils/errors';

const router = Router();

// Validation schemas
const createListingSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    price: z.number().positive(),
    currency: z.string().length(3).default('USD'),
    deliverables: z.string().optional(),
    platform: z.array(z.string()),
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
    deliverables: z.string().optional(),
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
  sanitizeInput,
  validate(createListingSchema),
  async (req, res, next) => {
    try {
      const creatorId = req.user!.id;
      const listingData = req.body;

      const listing = await prisma.listing.create({
        data: {
          ...listingData,
          creatorId,
          status: ListingStatus.ACTIVE,
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

// Get all listings (public with filters)
router.get('/', optionalAuth, pagination, async (req, res, next) => {
  try {
    const paginationParams = req.pagination!;
    const { status, creatorId, platform, featured, minPrice, maxPrice, search } = req.query;

    const where: any = {};

    if (status) {
      where.status = status as ListingStatus;
    } else {
      // Default to active listings for public view
      where.status = ListingStatus.ACTIVE;
    }

    if (creatorId) {
      where.creatorId = creatorId as string;
    }

    if (platform) {
      where.platform = { has: platform as string };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
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
              bio: true,
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
            isVerified: true,
            bio: true,
            socialLinks: true,
          },
        },
        campaign: true,
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
router.delete('/:id', authenticate, async (req, res, next) => {
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
});

export default router;
