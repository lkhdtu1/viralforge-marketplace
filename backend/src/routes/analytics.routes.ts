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
    
    // Get user engagement data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        loginCount: true,
        dailyUsageMinutes: true,
        totalClicks: true,
        streakDays: true,
        lastActiveAt: true,
        lastLoginAt: true,
      },
    });
    
    // Get event counts by type
    const eventCounts = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: { userId },
      _count: true,
    });
    
    // Get clicks count
    const clicksCount = eventCounts.find(e => e.eventType === 'click')?._count || 0;
    
    // Get daily usage (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyEvents = await prisma.analyticsEvent.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
      },
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
    
    // Calculate engagement metrics
    const totalViews = eventCounts.find(e => e.eventType === 'view' || e.eventType === 'page_view')?._count || 0;
    const totalEngagement = eventCounts.find(e => e.eventType === 'engagement' || e.eventType === 'like' || e.eventType === 'share')?._count || 0;
    
    res.json({
      success: true,
      data: {
        userEngagement: {
          loginCount: user?.loginCount || 0,
          dailyUsageMinutes: user?.dailyUsageMinutes || 0,
          totalClicks: user?.totalClicks || clicksCount,
          streakDays: user?.streakDays || 0,
          lastActiveAt: user?.lastActiveAt,
          lastLoginAt: user?.lastLoginAt,
        },
        eventCounts,
        recentEvents,
        metrics: {
          totalViews,
          totalEngagement,
          averageEngagement: totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Track click event
router.post('/click', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { target, targetId, location } = req.body;
    
    // Track in analytics events
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'click',
        eventData: { target, targetId, location },
      },
    });
    
    // Increment user click count
    await prisma.user.update({
      where: { id: userId },
      data: { 
        totalClicks: { increment: 1 },
        lastActiveAt: new Date(),
      },
    });
    
    res.json({
      success: true,
      message: 'Click tracked',
    });
  } catch (error) {
    next(error);
  }
});

// Track daily usage
router.post('/usage', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { minutes } = req.body;
    
    if (typeof minutes !== 'number' || minutes < 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid minutes value' },
      });
    }
    
    // Update daily usage
    await prisma.user.update({
      where: { id: userId },
      data: { 
        dailyUsageMinutes: minutes,
        lastActiveAt: new Date(),
      },
    });
    
    res.json({
      success: true,
      message: 'Usage tracked',
    });
  } catch (error) {
    next(error);
  }
});

export default router;

