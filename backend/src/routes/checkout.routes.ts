import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, authorize } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { UserRole } from '@prisma/client';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors';
import { createStripeCustomer, createPaymentIntent } from '../services/payment.service';
import { rateLimiter } from '../middleware/security';

const router = Router();

// Validation schema
const createCheckoutSchema = z.object({
  body: z.object({
    listingId: z.string().uuid().optional(),
    contractId: z.string().uuid().optional(),
    amount: z.number().positive().optional(), // Optional if using listing/contract
    currency: z.string().length(3).default('USD'),
  }),
});

// Create checkout session (payment intent)
router.post(
  '/',
  authenticate,
  authorize(UserRole.BRAND, UserRole.ADMIN),
  rateLimiter,
  sanitizeInput,
  validate(createCheckoutSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const { listingId, contractId, amount, currency } = req.body;
      
      let finalAmount: number;
      let contract;
      
      // If contractId provided, use existing contract
      if (contractId) {
        contract = await prisma.contract.findUnique({
          where: { id: contractId },
          include: {
            brand: true,
            creator: true,
            escrow: true,
          },
        });
        
        if (!contract) {
          throw new NotFoundError('Contract not found');
        }
        
        if (contract.brandId !== userId && req.user!.role !== UserRole.ADMIN) {
          throw new AuthorizationError('Not authorized');
        }
        
        // Check if escrow already exists
        if (contract.escrow) {
          throw new ValidationError('Escrow already exists for this contract');
        }
        
        finalAmount = Number(contract.amount);
      } else if (listingId) {
        // Create contract from listing
        const listing = await prisma.listing.findUnique({
          where: { id: listingId },
          include: { creator: true },
        });
        
        if (!listing) {
          throw new NotFoundError('Listing not found');
        }
        
        if (listing.status !== 'ACTIVE') {
          throw new ValidationError('Listing is not active');
        }
        
        // Create contract
        contract = await prisma.contract.create({
          data: {
            brandId: userId,
            creatorId: listing.creatorId,
            listingId: listingId,
            title: listing.title,
            terms: listing.deliverables || 'Standard contract terms',
            amount: listing.price,
            currency: listing.currency,
            status: 'PENDING',
          },
          include: {
            brand: true,
            creator: true,
          },
        });
        
        finalAmount = Number(listing.price);
      } else if (amount) {
        // Direct payment (for custom amounts)
        finalAmount = amount;
      } else {
        throw new ValidationError('Must provide listingId, contractId, or amount');
      }
      
      // Ensure Stripe customer exists
      const customerId = await createStripeCustomer(
        userId,
        contract?.brand.email || req.user!.email
      );
      
      // Create escrow if contract exists
      let escrow;
      if (contract) {
        escrow = await prisma.escrow.create({
          data: {
            contractId: contract.id,
            amount: finalAmount,
            currency: currency || 'USD',
            status: 'CREATED',
          },
        });
        
        // Create payment intent
        const paymentIntent = await createPaymentIntent(
          escrow.id,
          finalAmount,
          currency || 'USD',
          customerId
        );
        
        res.json({
          success: true,
          data: {
            contractId: contract.id,
            escrowId: escrow.id,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: finalAmount,
            currency: currency || 'USD',
          },
        });
      } else {
        // Direct payment without contract (not typical, but supported)
        // In production, you'd still want to create a contract/escrow
        res.status(400).json({
          success: false,
          error: { message: 'Contract creation required' },
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;

