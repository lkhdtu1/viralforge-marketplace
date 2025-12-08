import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { rateLimiter } from '../middleware/security';
import gamificationService from '../services/gamification.service';

const router = Router();

/**
 * @swagger
 * /api/v1/gamification/level:
 *   get:
 *     summary: Get user level and progress
 *     tags: [Gamification]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/level',
  authenticate,
  rateLimiter,
  async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const userLevel = await gamificationService.getUserLevel(userId);

      res.json({
        success: true,
        data: { userLevel },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/gamification/top-creators:
 *   get:
 *     summary: Get top creators ranking
 *     tags: [Gamification]
 */
router.get(
  '/top-creators',
  rateLimiter,
  async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topCreators = await gamificationService.getTopCreators(limit);

      res.json({
        success: true,
        data: { creators: topCreators },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/gamification/top-brands:
 *   get:
 *     summary: Get top brands ranking
 *     tags: [Gamification]
 */
router.get(
  '/top-brands',
  rateLimiter,
  async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topBrands = await gamificationService.getTopBrands(limit);

      res.json({
        success: true,
        data: { brands: topBrands },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;



