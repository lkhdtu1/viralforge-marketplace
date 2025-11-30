import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { pagination, paginatedResponse } from '../middleware/pagination';
import { UserRole } from '@prisma/client';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { rateLimiter } from '../middleware/security';

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    displayName: z.string().optional(),
    bio: z.string().max(1000).optional(),
    website: z.string().url().optional(),
    socialLinks: z.object({
      twitter: z.string().url().optional(),
      instagram: z.string().url().optional(),
      tiktok: z.string().url().optional(),
      youtube: z.string().url().optional(),
    }).optional(),
  }),
});

// Search users (public)
router.get('/search', async (req, res, next) => {
  try {
    const { q, role } = req.query;
    
    if (!q || (q as string).length < 2) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const where: any = {
      isActive: true,
      OR: [
        { displayName: { contains: q as string, mode: 'insensitive' } },
        { email: { contains: q as string, mode: 'insensitive' } },
      ],
    };

    if (role) {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      take: 10,
      select: {
        id: true,
        displayName: true,
        avatar: true,
        role: true,
        isVerified: true,
        bio: true,
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// Get user profile (public)
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        displayName: true,
        avatar: true,
        bio: true,
        website: true,
        socialLinks: true,
        isVerified: true,
        role: true,
        createdAt: true,
        // Only show email if viewing own profile
        ...(req.user?.id === id && {
          email: true,
          emailVerified: true,
          firstName: true,
          lastName: true,
        }),
      },
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Update own profile
router.put(
  '/profile',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(updateProfileSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const updateData = req.body;
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatar: true,
          bio: true,
          website: true,
          socialLinks: true,
          role: true,
          updatedAt: true,
        },
      });
      
      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user's campaigns (if brand) or listings (if creator)
router.get('/:id/campaigns', pagination, async (req, res, next) => {
  try {
    const { id } = req.params;
    const paginationParams = req.pagination!;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    if (user.role === UserRole.BRAND) {
      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          where: { brandId: id },
          skip: paginationParams.skip,
          take: paginationParams.limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.campaign.count({ where: { brandId: id } }),
      ]);
      
      res.json(paginatedResponse(campaigns, total, paginationParams));
    } else {
      throw new AuthorizationError('User is not a brand');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:id/listings', pagination, async (req, res, next) => {
  try {
    const { id } = req.params;
    const paginationParams = req.pagination!;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    if (user.role === UserRole.CREATOR) {
      const [listings, total] = await Promise.all([
        prisma.listing.findMany({
          where: { creatorId: id },
          skip: paginationParams.skip,
          take: paginationParams.limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.listing.count({ where: { creatorId: id } }),
      ]);
      
      res.json(paginatedResponse(listings, total, paginationParams));
    } else {
      throw new AuthorizationError('User is not a creator');
    }
  } catch (error) {
    next(error);
  }
});

// Admin: Get all users
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  pagination,
  async (req, res, next) => {
    try {
      const paginationParams = req.pagination!;
      const { role, search } = req.query;
      
      const where: any = {};
      
      if (role) {
        where.role = role;
      }
      
      if (search) {
        where.OR = [
          { email: { contains: search as string, mode: 'insensitive' } },
          { displayName: { contains: search as string, mode: 'insensitive' } },
        ];
      }
      
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: paginationParams.skip,
          take: paginationParams.limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            displayName: true,
            role: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
          },
        }),
        prisma.user.count({ where }),
      ]);
      
      res.json(paginatedResponse(users, total, paginationParams));
    } catch (error) {
      next(error);
    }
  }
);

export default router;

