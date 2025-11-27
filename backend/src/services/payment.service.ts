import Stripe from 'stripe';
import env from '../config/env';
import prisma from '../config/database';
import { EscrowStatus, TransactionType, TransactionStatus } from '@prisma/client';
import { NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';

// Initialize Stripe
// OWASP: Use environment variables for API keys, never hardcode
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

// Create Stripe customer for user
export const createStripeCustomer = async (
  userId: string,
  email: string
): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }
  
  // Create Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });
  
  // Update user with Stripe customer ID
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });
  
  return customer.id;
};

// Create payment intent for escrow
export const createPaymentIntent = async (
  escrowId: string,
  amount: number,
  currency: string = 'USD',
  customerId: string
): Promise<Stripe.PaymentIntent> => {
  const escrow = await prisma.escrow.findUnique({
    where: { id: escrowId },
    include: { contract: true },
  });
  
  if (!escrow) {
    throw new NotFoundError('Escrow not found');
  }
  
  if (escrow.status !== EscrowStatus.CREATED) {
    throw new ValidationError('Escrow is not in CREATED status');
  }
  
  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    customer: customerId,
    metadata: {
      escrowId,
      contractId: escrow.contractId,
    },
    description: `Payment for contract: ${escrow.contract.title}`,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  
  // Update escrow with payment intent ID
  await prisma.escrow.update({
    where: { id: escrowId },
    data: { stripePaymentIntentId: paymentIntent.id },
  });
  
  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId: escrow.contract.brandId,
      contractId: escrow.contractId,
      escrowId: escrowId,
      type: TransactionType.PAYMENT,
      amount: amount,
      currency: currency,
      status: TransactionStatus.PENDING,
      description: `Payment intent created for escrow ${escrowId}`,
      metadata: {
        paymentIntentId: paymentIntent.id,
      },
    },
  });
  
  return paymentIntent;
};

// Handle Stripe webhook events
export const handleStripeWebhook = async (
  event: Stripe.Event
): Promise<void> => {
  logger.info(`Processing Stripe webhook: ${event.type}`);
  
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailure(paymentIntent);
      break;
    }
    
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      await handleRefund(charge);
      break;
    }
    
    default:
      logger.warn(`Unhandled webhook event type: ${event.type}`);
  }
};

// Handle successful payment
const handlePaymentSuccess = async (paymentIntent: Stripe.PaymentIntent) => {
  const escrowId = paymentIntent.metadata.escrowId;
  
  if (!escrowId) {
    logger.error('Payment intent missing escrowId metadata');
    return;
  }
  
  const escrow = await prisma.escrow.findUnique({
    where: { id: escrowId },
    include: { contract: true },
  });
  
  if (!escrow) {
    logger.error(`Escrow not found: ${escrowId}`);
    return;
  }
  
  // Update escrow status to FUNDED
  await prisma.escrow.update({
    where: { id: escrowId },
    data: {
      status: EscrowStatus.FUNDED,
      fundedAt: new Date(),
    },
  });
  
  // Update contract status to SIGNED
  await prisma.contract.update({
    where: { id: escrow.contractId },
    data: {
      status: 'SIGNED',
      signedAt: new Date(),
    },
  });
  
  // Update transaction status
  await prisma.transaction.updateMany({
    where: {
      escrowId: escrowId,
      status: TransactionStatus.PENDING,
    },
    data: {
      status: TransactionStatus.COMPLETED,
      stripeChargeId: paymentIntent.latest_charge as string,
    },
  });
  
  logger.info(`Escrow ${escrowId} funded successfully`);
};

// Handle failed payment
const handlePaymentFailure = async (paymentIntent: Stripe.PaymentIntent) => {
  const escrowId = paymentIntent.metadata.escrowId;
  
  if (!escrowId) {
    return;
  }
  
  // Update transaction status
  await prisma.transaction.updateMany({
    where: {
      escrowId: escrowId,
      status: TransactionStatus.PENDING,
    },
    data: {
      status: TransactionStatus.FAILED,
    },
  });
  
  logger.warn(`Payment failed for escrow ${escrowId}`);
};

// Handle refund
const handleRefund = async (charge: Stripe.Charge) => {
  // Find escrow by charge ID
  const transaction = await prisma.transaction.findFirst({
    where: {
      stripeChargeId: charge.id,
    },
    include: {
      escrow: true,
    },
  });
  
  if (!transaction || !transaction.escrow) {
    logger.error(`Transaction not found for charge: ${charge.id}`);
    return;
  }
  
  // Update escrow status to REFUNDED
  await prisma.escrow.update({
    where: { id: transaction.escrowId! },
    data: {
      status: EscrowStatus.REFUNDED,
      refundedAt: new Date(),
    },
  });
  
  // Create refund transaction
  await prisma.transaction.create({
    data: {
      userId: transaction.userId,
      contractId: transaction.contractId,
      escrowId: transaction.escrowId,
      type: TransactionType.REFUND,
      amount: transaction.amount,
      currency: transaction.currency,
      status: TransactionStatus.COMPLETED,
      stripeChargeId: charge.id,
      description: `Refund for escrow ${transaction.escrowId}`,
    },
  });
  
  logger.info(`Refund processed for escrow ${transaction.escrowId}`);
};

// Release escrow funds to creator
export const releaseEscrowFunds = async (
  escrowId: string,
  releasedBy: string
): Promise<void> => {
  const escrow = await prisma.escrow.findUnique({
    where: { id: escrowId },
    include: { contract: { include: { creator: true } } },
  });
  
  if (!escrow) {
    throw new NotFoundError('Escrow not found');
  }
  
  if (escrow.status !== EscrowStatus.COMPLETED) {
    throw new ValidationError('Escrow must be in COMPLETED status to release funds');
  }
  
  if (!escrow.stripePaymentIntentId) {
    throw new ValidationError('Payment intent not found');
  }
  
  // Retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(
    escrow.stripePaymentIntentId
  );
  
  // Transfer funds to creator's Stripe account
  // Note: In production, you'd use Stripe Connect for this
  // For now, we'll mark it as released
  // TODO: Implement Stripe Connect transfer
  
  // Update escrow status
  await prisma.escrow.update({
    where: { id: escrowId },
    data: {
      status: EscrowStatus.RELEASED,
      releasedAt: new Date(),
    },
  });
  
  // Update contract status
  await prisma.contract.update({
    where: { id: escrow.contractId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });
  
  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId: escrow.contract.creatorId,
      contractId: escrow.contractId,
      escrowId: escrowId,
      type: TransactionType.PAYMENT,
      amount: escrow.amount,
      currency: escrow.currency,
      status: TransactionStatus.COMPLETED,
      description: `Funds released to creator for escrow ${escrowId}`,
      metadata: {
        releasedBy,
      },
    },
  });
  
  logger.info(`Escrow ${escrowId} released to creator`);
};

// Refund escrow funds to brand
export const refundEscrowFunds = async (
  escrowId: string,
  reason: string,
  refundedBy: string
): Promise<void> => {
  const escrow = await prisma.escrow.findUnique({
    where: { id: escrowId },
    include: { contract: true },
  });
  
  if (!escrow) {
    throw new NotFoundError('Escrow not found');
  }
  
  if (!['FUNDED', 'IN_PROGRESS', 'COMPLETED'].includes(escrow.status)) {
    throw new ValidationError('Escrow cannot be refunded in current status');
  }
  
  if (!escrow.stripePaymentIntentId) {
    throw new ValidationError('Payment intent not found');
  }
  
  // Retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(
    escrow.stripePaymentIntentId
  );
  
  // Refund the payment
  if (paymentIntent.latest_charge) {
    await stripe.refunds.create({
      charge: paymentIntent.latest_charge as string,
      reason: 'requested_by_customer',
      metadata: {
        escrowId,
        reason,
        refundedBy,
      },
    });
  }
  
  // Update escrow status
  await prisma.escrow.update({
    where: { id: escrowId },
    data: {
      status: EscrowStatus.REFUNDED,
      refundedAt: new Date(),
      disputeReason: reason,
    },
  });
  
  // Update contract status
  await prisma.contract.update({
    where: { id: escrow.contractId },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
    },
  });
  
  logger.info(`Escrow ${escrowId} refunded: ${reason}`);
};

// Update escrow status (state machine)
export const updateEscrowStatus = async (
  escrowId: string,
  newStatus: EscrowStatus,
  userId: string
): Promise<void> => {
  const escrow = await prisma.escrow.findUnique({
    where: { id: escrowId },
    include: { contract: true },
  });
  
  if (!escrow) {
    throw new NotFoundError('Escrow not found');
  }
  
  // State machine validation
  // OWASP: State machine prevents invalid state transitions
  const validTransitions: Record<EscrowStatus, EscrowStatus[]> = {
    [EscrowStatus.CREATED]: [EscrowStatus.FUNDED, EscrowStatus.REFUNDED],
    [EscrowStatus.FUNDED]: [EscrowStatus.IN_PROGRESS, EscrowStatus.REFUNDED],
    [EscrowStatus.IN_PROGRESS]: [EscrowStatus.COMPLETED, EscrowStatus.REFUNDED],
    [EscrowStatus.COMPLETED]: [EscrowStatus.RELEASED, EscrowStatus.REFUNDED],
    [EscrowStatus.RELEASED]: [], // Terminal state
    [EscrowStatus.REFUNDED]: [], // Terminal state
  };
  
  if (!validTransitions[escrow.status].includes(newStatus)) {
    throw new ValidationError(
      `Invalid status transition from ${escrow.status} to ${newStatus}`
    );
  }
  
  // Authorization check
  const isBrand = escrow.contract.brandId === userId;
  const isCreator = escrow.contract.creatorId === userId;
  
  // Only brand can mark as IN_PROGRESS, creator can mark as COMPLETED
  if (newStatus === EscrowStatus.IN_PROGRESS && !isBrand) {
    throw new ValidationError('Only brand can mark escrow as IN_PROGRESS');
  }
  
  if (newStatus === EscrowStatus.COMPLETED && !isCreator) {
    throw new ValidationError('Only creator can mark escrow as COMPLETED');
  }
  
  // Update status
  await prisma.escrow.update({
    where: { id: escrowId },
    data: { status: newStatus },
  });
  
  logger.info(`Escrow ${escrowId} status updated to ${newStatus}`);
};

