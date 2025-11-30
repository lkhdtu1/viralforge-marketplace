import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { pagination, paginatedResponse } from '../middleware/pagination';
import { ContractStatus } from '@prisma/client';
import { NotFoundError, AuthorizationError } from '../utils/errors';

const router = Router();

// Validation schemas
const createContractSchema = z.object({
  body: z.object({
    creatorId: z.string().uuid(),
    listingId: z.string().uuid().optional(),
    campaignId: z.string().uuid().optional(),
    title: z.string().min(1).max(200),
    terms: z.string().min(1),
    amount: z.number().positive(),
    currency: z.string().length(3).default('USD'),
  }),
});

const updateContractSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ContractStatus).optional(),
    terms: z.string().optional(),
  }),
});

// Create contract (checkout from cart)
router.post(
  '/',
  authenticate,
  sanitizeInput,
  validate(createContractSchema),
  async (req, res, next) => {
    try {
      const brandId = req.user!.id;
      const { creatorId, listingId, campaignId, title, terms, amount, currency } = req.body;

      const contract = await prisma.contract.create({
        data: {
          brandId,
          creatorId,
          listingId,
          campaignId,
          title,
          terms,
          amount,
          currency,
          status: ContractStatus.PENDING,
        },
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
              email: true,
            },
          },
          listing: true,
        },
      });

      res.status(201).json({
        success: true,
        data: { contract },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user's contracts
router.get('/', authenticate, pagination, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const paginationParams = req.pagination!;
    const { status } = req.query;

    const where: any = {};
    
    // Filter by role
    if (userRole === 'BRAND') {
      where.brandId = userId;
    } else if (userRole === 'CREATOR') {
      where.creatorId = userId;
    }

    if (status) {
      where.status = status as ContractStatus;
    }

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
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
            },
          },
          creator: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
            },
          },
          listing: true,
          campaign: true,
        },
      }),
      prisma.contract.count({ where }),
    ]);

    res.json(paginatedResponse(contracts, total, paginationParams));
  } catch (error) {
    next(error);
  }
});

// Get contract by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            email: true,
          },
        },
        listing: true,
        campaign: true,
        escrow: true,
      },
    });

    if (!contract) {
      throw new NotFoundError('Contract not found');
    }

    // Check authorization
    if (contract.brandId !== userId && contract.creatorId !== userId && req.user!.role !== 'ADMIN') {
      throw new AuthorizationError('Not authorized to view this contract');
    }

    res.json({
      success: true,
      data: { contract },
    });
  } catch (error) {
    next(error);
  }
});

// Update contract status
router.patch(
  '/:id',
  authenticate,
  sanitizeInput,
  validate(updateContractSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { status, terms } = req.body;

      const contract = await prisma.contract.findUnique({
        where: { id },
      });

      if (!contract) {
        throw new NotFoundError('Contract not found');
      }

      // Check authorization
      if (contract.brandId !== userId && contract.creatorId !== userId && req.user!.role !== 'ADMIN') {
        throw new AuthorizationError('Not authorized to update this contract');
      }

      const updateData: any = {};
      if (status) updateData.status = status;
      if (terms) updateData.terms = terms;

      // Set timestamps based on status
      if (status === ContractStatus.SIGNED) {
        updateData.signedAt = new Date();
      } else if (status === ContractStatus.COMPLETED) {
        updateData.completedAt = new Date();
      } else if (status === ContractStatus.CANCELLED) {
        updateData.cancelledAt = new Date();
      }

      const updated = await prisma.contract.update({
        where: { id },
        data: updateData,
        include: {
          brand: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
            },
          },
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
        data: { contract: updated },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete contract (only if pending)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const contract = await prisma.contract.findUnique({
      where: { id },
    });

    if (!contract) {
      throw new NotFoundError('Contract not found');
    }

    // Only brand can delete, and only if pending
    if (contract.brandId !== userId) {
      throw new AuthorizationError('Only the brand can delete contracts');
    }

    if (contract.status !== ContractStatus.PENDING) {
      throw new AuthorizationError('Can only delete pending contracts');
    }

    await prisma.contract.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Contract deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
