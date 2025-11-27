import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { rateLimiter } from '../middleware/security';
import logger from '../utils/logger';

const router = Router();

// Validation schema for analytics events
const analyticsEventSchema = z.object({
  body: z.object({
    eventType: z.string().min(1).max(100),
    eventData: z.record(z.any()).optional(),
    sessionId: z.string().optional(),
  }),
});

// Batch analytics events schema
const batchAnalyticsSchema = z.object({
  body: z.object({
    events: z.array(z.object({
      eventType: z.string().min(1).max(100),
      eventData: z.record(z.any()).optional(),
      sessionId: z.string().optional(),
    })).min(1).max(100), // Limit batch size
  }),
});

// Track single analytics event
router.post(
  '/events',
  optionalAuth,
  rateLimiter,
  sanitizeInput,
  validate(analyticsEventSchema),
  async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { eventType, eventData, sessionId } = req.body;
      
      // OWASP: Sanitize and validate event data to prevent injection
      const event = await prisma.analyticsEvent.create({
        data: {
          userId: userId || null,
          eventType,
          eventData: eventData || {},
          sessionId: sessionId || null,
          ipAddress: req.ip,
          userAgent: req.get('user-agent') || null,
          referrer: req.get('referer') || null,
        },
      });
      
      res.status(201).json({
        success: true,
        data: { eventId: event.id },
      });
    } catch (error) {
      logger.error('Error tracking analytics event:', error);
      // Don't fail the request if analytics fails
      res.status(201).json({
        success: true,
        message: 'Event tracked',
      });
    }
  }
);

// Track batch analytics events (for performance)
router.post(
  '/events/batch',
  optionalAuth,
  rateLimiter,
  sanitizeInput,
  validate(batchAnalyticsSchema),
  async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { events } = req.body;
      
      // Create events in batch
      const createdEvents = await prisma.analyticsEvent.createMany({
        data: events.map((event: any) => ({
          userId: userId || null,
          eventType: event.eventType,
          eventData: event.eventData || {},
          sessionId: event.sessionId || null,
          ipAddress: req.ip,
          userAgent: req.get('user-agent') || null,
          referrer: req.get('referer') || null,
        })),
      });
      
      res.status(201).json({
        success: true,
        data: { count: createdEvents.count },
      });
    } catch (error) {
      logger.error('Error tracking batch analytics events:', error);
      res.status(201).json({
        success: true,
        message: 'Events tracked',
      });
    }
  }
);

// Get user's analytics (if authenticated)
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    
    // Get event counts by type
    const eventCounts = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: { userId },
      _count: true,
    });
    
    // Get recent events
    const recentEvents = await prisma.analyticsEvent.findMany({
      where: { userId },
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        eventType: true,
        eventData: true,
        createdAt: true,
      },
    });
    
    res.json({
      success: true,
      data: {
        eventCounts,
        recentEvents,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

