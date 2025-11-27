import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, authorize } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { pagination, paginatedResponse } from '../middleware/pagination';
import { UserRole, ContractStatus, EscrowStatus } from '@prisma/client';
import { NotFoundError, ValidationError } from '../utils/errors';
import { releaseEscrowFunds, refundEscrowFunds } from '../services/payment.service';
import { rateLimiter } from '../middleware/security';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

// Validation schemas
const resolveDisputeSchema = z.object({
  body: z.object({
    escrowId: z.string().uuid(),
    action: z.enum(['release', 'refund']),
    reason: z.string().min(1).max(500),
  }),
});

const manualPayoutSchema = z.object({
  body: z.object({
    escrowId: z.string().uuid(),
    amount: z.number().positive().optional(), // Optional, defaults to escrow amount
    reason: z.string().min(1).max(500),
  }),
});

const updateUserStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    role: z.nativeEnum(UserRole).optional(),
  }),
});

// Get all disputes (contracts with DISPUTED status)
router.get('/disputes', pagination, async (req, res, next) => {
  try {
    const paginationParams = req.pagination!;
    
    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where: { status: ContractStatus.DISPUTED },
        skip: paginationParams.skip,
        take: paginationParams.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
          creator: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
          escrow: true,
        },
      }),
      prisma.contract.count({ where: { status: ContractStatus.DISPUTED } }),
    ]);
    
    res.json(paginatedResponse(contracts, total, paginationParams));
  } catch (error) {
    next(error);
  }
});

// Resolve dispute
router.post(
  '/disputes/resolve',
  rateLimiter,
  sanitizeInput,
  validate(resolveDisputeSchema),
  async (req, res, next) => {
    try {
      const { escrowId, action, reason } = req.body;
      const adminId = req.user!.id;
      
      const escrow = await prisma.escrow.findUnique({
        where: { id: escrowId },
        include: { contract: true },
      });
      
      if (!escrow) {
        throw new NotFoundError('Escrow not found');
      }
      
      if (escrow.contract.status !== ContractStatus.DISPUTED) {
        throw new ValidationError('Contract is not in disputed status');
      }
      
      if (action === 'release') {
        await releaseEscrowFunds(escrowId, adminId);
      } else if (action === 'refund') {
        await refundEscrowFunds(escrowId, reason, adminId);
      }
      
      // Update contract status
      await prisma.contract.update({
        where: { id: escrow.contractId },
        data: {
          status: action === 'release' ? ContractStatus.COMPLETED : ContractStatus.CANCELLED,
        },
      });
      
      const updated = await prisma.escrow.findUnique({
        where: { id: escrowId },
        include: { contract: true },
      });
      
      res.json({
        success: true,
        data: { escrow: updated },
        message: `Dispute resolved: ${action}`,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Manual payout (admin override)
router.post(
  '/payouts/manual',
  rateLimiter,
  sanitizeInput,
  validate(manualPayoutSchema),
  async (req, res, next) => {
    try {
      const { escrowId, amount, reason } = req.body;
      const adminId = req.user!.id;
      
      const escrow = await prisma.escrow.findUnique({
        where: { id: escrowId },
        include: { contract: true },
      });
      
      if (!escrow) {
        throw new NotFoundError('Escrow not found');
      }
      
      // Admin can release funds even if not in COMPLETED status
      if (escrow.status === EscrowStatus.RELEASED) {
        throw new ValidationError('Escrow already released');
      }
      
      if (escrow.status === EscrowStatus.REFUNDED) {
        throw new ValidationError('Escrow already refunded');
      }
      
      // Release funds
      await releaseEscrowFunds(escrowId, adminId);
      
      // Create admin note transaction
      await prisma.transaction.create({
        data: {
          userId: escrow.contract.creatorId,
          contractId: escrow.contractId,
          escrowId: escrowId,
          type: 'PAYMENT',
          amount: amount ? amount : escrow.amount,
          currency: escrow.currency,
          status: 'COMPLETED',
          description: `Manual payout by admin: ${reason}`,
          metadata: {
            adminId,
            reason,
            manual: true,
          },
        },
      });
      
      const updated = await prisma.escrow.findUnique({
        where: { id: escrowId },
        include: { contract: true },
      });
      
      res.json({
        success: true,
        data: { escrow: updated },
        message: 'Manual payout processed',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update user status (activate/deactivate, verify, change role)
router.patch(
  '/users/:id/status',
  rateLimiter,
  sanitizeInput,
  validate(updateUserStatusSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const user = await prisma.user.findUnique({
        where: { id },
      });
      
      if (!user) {
        throw new NotFoundError('User not found');
      }
      
      const updated = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          isActive: true,
          isVerified: true,
          updatedAt: true,
        },
      });
      
      res.json({
        success: true,
        data: { user: updated },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get platform statistics
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalBrands,
      totalCreators,
      totalCampaigns,
      totalListings,
      totalContracts,
      totalRevenue,
      activeEscrows,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.BRAND } }),
      prisma.user.count({ where: { role: UserRole.CREATOR } }),
      prisma.campaign.count(),
      prisma.listing.count(),
      prisma.contract.count(),
      prisma.transaction.aggregate({
        where: {
          type: 'PAYMENT',
          status: 'COMPLETED',
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.escrow.count({
        where: {
          status: {
            in: [EscrowStatus.FUNDED, EscrowStatus.IN_PROGRESS, EscrowStatus.COMPLETED],
          },
        },
      }),
    ]);
    
    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          brands: totalBrands,
          creators: totalCreators,
        },
        campaigns: totalCampaigns,
        listings: totalListings,
        contracts: totalContracts,
        revenue: totalRevenue._sum.amount || 0,
        activeEscrows,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

