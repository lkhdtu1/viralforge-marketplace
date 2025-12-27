import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { rateLimiter } from '../middleware/security';
import { mfaService } from '../services/mfa.service';

const router = Router();

// Validation schemas
const verifyTokenSchema = z.object({
  body: z.object({
    token: z.string().min(6).max(8),
  }),
});

/**
 * @swagger
 * /api/v1/mfa/status:
 *   get:
 *     summary: Get MFA status
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA status
 */
router.get('/status', authenticate, async (req, res, next) => {
  try {
    const status = await mfaService.getMFAStatus(req.user!.id);
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/mfa/setup:
 *   post:
 *     summary: Setup MFA (generate QR code)
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA setup data
 */
router.post('/setup', authenticate, rateLimiter, async (req, res, next) => {
  try {
    const setupData = await mfaService.setupMFA(req.user!.id);
    res.json({
      success: true,
      data: setupData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/mfa/enable:
 *   post:
 *     summary: Enable MFA after verification
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP code
 *     responses:
 *       200:
 *         description: MFA enabled successfully
 */
router.post(
  '/enable',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(verifyTokenSchema),
  async (req, res, next) => {
    try {
      const { token } = req.body;
      await mfaService.enableMFA(req.user!.id, token);
      res.json({
        success: true,
        message: 'MFA enabled successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/mfa/disable:
 *   post:
 *     summary: Disable MFA
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP code
 *     responses:
 *       200:
 *         description: MFA disabled successfully
 */
router.post(
  '/disable',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(verifyTokenSchema),
  async (req, res, next) => {
    try {
      const { token } = req.body;
      await mfaService.disableMFA(req.user!.id, token);
      res.json({
        success: true,
        message: 'MFA disabled successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/mfa/verify:
 *   post:
 *     summary: Verify MFA token during login
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP code or backup code
 *     responses:
 *       200:
 *         description: Token verified successfully
 */
router.post(
  '/verify',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(verifyTokenSchema),
  async (req, res, next) => {
    try {
      const { token } = req.body;
      const verified = await mfaService.verifyMFA(req.user!.id, token);
      
      if (!verified) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid verification code' },
        });
      }

      res.json({
        success: true,
        message: 'Token verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/mfa/backup-codes:
 *   post:
 *     summary: Generate new backup codes
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP code
 *     responses:
 *       200:
 *         description: New backup codes generated
 */
router.post(
  '/backup-codes',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(verifyTokenSchema),
  async (req, res, next) => {
    try {
      const { token } = req.body;
      const backupCodes = await mfaService.generateNewBackupCodes(req.user!.id, token);
      res.json({
        success: true,
        data: { backupCodes },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
