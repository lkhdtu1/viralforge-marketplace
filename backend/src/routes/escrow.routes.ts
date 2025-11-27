import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, authorize } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { UserRole, EscrowStatus } from '@prisma/client';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors';
import {
  createPaymentIntent,
  releaseEscrowFunds,
  refundEscrowFunds,
  updateEscrowStatus,
} from '../services/payment.service';
import { createStripeCustomer } from '../services/payment.service';
import { rateLimiter } from '../middleware/security';

const router = Router();

// Validation schemas
const createEscrowSchema = z.object({
  body: z.object({
    contractId: z.string().uuid(),
  }),
});

const updateEscrowStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(EscrowStatus),
  }),
});

const releaseEscrowSchema = z.object({
  body: z.object({
    escrowId: z.string().uuid(),
  }),
});

const refundEscrowSchema = z.object({
  body: z.object({
    escrowId: z.string().uuid(),
    reason: z.string().min(1).max(500),
  }),
});

// Create escrow for a contract
router.post(
  '/',
  authenticate,
  authorize(UserRole.BRAND, UserRole.ADMIN),
  rateLimiter,
  sanitizeInput,
  validate(createEscrowSchema),
  async (req, res, next) => {
    try {
      const { contractId } = req.body;
      const userId = req.user!.id;
      
      // Verify contract exists and user is the brand
      const contract = await prisma.contract.findUnique({
        where: { id: contractId },
        include: {
          brand: true,
          creator: true,
        },
      });
      
      if (!contract) {
        throw new NotFoundError('Contract not found');
      }
      
      if (contract.brandId !== userId && req.user!.role !== UserRole.ADMIN) {
        throw new AuthorizationError('Not authorized to create escrow for this contract');
      }
      
      // Check if escrow already exists
      const existingEscrow = await prisma.escrow.findUnique({
        where: { contractId },
      });
      
      if (existingEscrow) {
        throw new ValidationError('Escrow already exists for this contract');
      }
      
      // Create escrow
      const escrow = await prisma.escrow.create({
        data: {
          contractId,
          amount: contract.amount,
          currency: contract.currency,
          status: EscrowStatus.CREATED,
        },
        include: {
          contract: {
            include: {
              brand: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
              creator: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
            },
          },
        },
      });
      
      res.status(201).json({
        success: true,
        data: { escrow },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get escrow by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    
    const escrow = await prisma.escrow.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            brand: {
              select: {
                id: true,
                displayName: true,
              },
            },
            creator: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (!escrow) {
      throw new NotFoundError('Escrow not found');
    }
    
    // Check authorization (brand, creator, or admin)
    const isAuthorized =
      escrow.contract.brandId === userId ||
      escrow.contract.creatorId === userId ||
      req.user!.role === UserRole.ADMIN;
    
    if (!isAuthorized) {
      throw new AuthorizationError('Not authorized to view this escrow');
    }
    
    res.json({
      success: true,
      data: { escrow },
    });
  } catch (error) {
    next(error);
  }
});

// Create payment intent for escrow
router.post(
  '/:id/payment-intent',
  authenticate,
  authorize(UserRole.BRAND, UserRole.ADMIN),
  rateLimiter,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      const escrow = await prisma.escrow.findUnique({
        where: { id },
        include: { contract: { include: { brand: true } } },
      });
      
      if (!escrow) {
        throw new NotFoundError('Escrow not found');
      }
      
      if (escrow.contract.brandId !== userId && req.user!.role !== UserRole.ADMIN) {
        throw new AuthorizationError('Not authorized');
      }
      
      // Ensure Stripe customer exists
      const customerId = await createStripeCustomer(
        escrow.contract.brandId,
        escrow.contract.brand.email
      );
      
      // Create payment intent
      const paymentIntent = await createPaymentIntent(
        id,
        Number(escrow.amount),
        escrow.currency,
        customerId
      );
      
      res.json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update escrow status (state machine)
router.patch(
  '/:id/status',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(updateEscrowStatusSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user!.id;
      
      await updateEscrowStatus(id, status, userId);
      
      const escrow = await prisma.escrow.findUnique({
        where: { id },
        include: { contract: true },
      });
      
      res.json({
        success: true,
        data: { escrow },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Release escrow funds (admin or brand after completion)
router.post(
  '/:id/release',
  authenticate,
  authorize(UserRole.BRAND, UserRole.ADMIN),
  rateLimiter,
  sanitizeInput,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      const escrow = await prisma.escrow.findUnique({
        where: { id },
        include: { contract: true },
      });
      
      if (!escrow) {
        throw new NotFoundError('Escrow not found');
      }
      
      // Only brand or admin can release
      if (escrow.contract.brandId !== userId && req.user!.role !== UserRole.ADMIN) {
        throw new AuthorizationError('Not authorized to release escrow');
      }
      
      await releaseEscrowFunds(id, userId);
      
      const updated = await prisma.escrow.findUnique({
        where: { id },
        include: { contract: true },
      });
      
      res.json({
        success: true,
        data: { escrow: updated },
        message: 'Escrow funds released successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Refund escrow funds
router.post(
  '/:id/refund',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(refundEscrowSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const userId = req.user!.id;
      
      const escrow = await prisma.escrow.findUnique({
        where: { id },
        include: { contract: true },
      });
      
      if (!escrow) {
        throw new NotFoundError('Escrow not found');
      }
      
      // Brand, creator, or admin can request refund
      const isAuthorized =
        escrow.contract.brandId === userId ||
        escrow.contract.creatorId === userId ||
        req.user!.role === UserRole.ADMIN;
      
      if (!isAuthorized) {
        throw new AuthorizationError('Not authorized to refund escrow');
      }
      
      await refundEscrowFunds(id, reason, userId);
      
      const updated = await prisma.escrow.findUnique({
        where: { id },
        include: { contract: true },
      });
      
      res.json({
        success: true,
        data: { escrow: updated },
        message: 'Escrow refunded successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

