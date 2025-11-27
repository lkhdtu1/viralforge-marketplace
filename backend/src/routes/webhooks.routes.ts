import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import env from '../config/env';
import { handleStripeWebhook } from '../services/payment.service';
import logger from '../utils/logger';
import { errorHandler } from '../utils/errors';

const router = Router();

// Stripe webhook endpoint
// OWASP: Webhook endpoints should verify signatures to prevent unauthorized requests
router.post(
  '/stripe',
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    
    if (!sig || !env.STRIPE_WEBHOOK_SECRET) {
      logger.error('Missing Stripe signature or webhook secret');
      return res.status(400).send('Missing signature');
    }
    
    let event: Stripe.Event;
    
    try {
      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-11-20.acacia',
      });
      
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      logger.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    try {
      // Handle the event
      await handleStripeWebhook(event);
      
      // Return a response to acknowledge receipt of the event
      res.json({ received: true });
    } catch (error) {
      logger.error('Error handling webhook:', error);
      // Still return 200 to prevent Stripe from retrying
      res.status(200).json({ received: true, error: 'Processing failed' });
    }
  }
);

// Note: Stripe webhooks require raw body for signature verification
// In Express, you need to use express.raw() middleware for this route
// This is handled in server.ts

export default router;

