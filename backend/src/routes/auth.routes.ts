import { Router } from 'express';
import { z } from 'zod';
import passport from '../config/passport';
import env from '../config/env';
import {
  registerUser,
  loginUser,
  verifyEmail,
  resetPassword,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  revokeRefreshToken,
  verifyRefreshToken,
  generateTokens,
  storeRefreshToken,
  verifyPassword,
  hashPassword,
} from '../services/auth.service';
import { handleOAuthLogin } from '../services/oauth.service';
import { authenticate } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { rateLimiter, authRateLimiter } from '../middleware/security';
import prisma from '../config/database';
import logger from '../utils/logger';
import { AuthenticationError, NotFoundError } from '../utils/errors';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [CREATOR, BRAND]
 *               displayName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *       401:
 *         description: Unauthorized
 */

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    role: z.enum(['BRAND', 'CREATOR']).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    displayName: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    mfaToken: z.string().optional(),
  }),
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string().min(8).max(100),
  }),
});

// Register new user
router.post(
  '/register',
  // rateLimiter,
  // sanitizeInput,
  // validate(registerSchema),
  async (req, res, next) => {
    try {
      const { email, password, role, firstName, lastName, displayName } = req.body;
      
      const user = await registerUser(email, password, role, {
        firstName,
        lastName,
        displayName,
      });
      
      // Generate verification token
      const verificationToken = generateEmailVerificationToken(user.id);
      
      // TODO: Send verification email
      logger.info(`User registered: ${user.email}, verification token: ${verificationToken}`);
      
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
          },
          message: 'Registration successful. Please check your email for verification.',
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login user
router.post(
  '/login',
  // authRateLimiter,
  // sanitizeInput,
  // validate(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password, mfaToken } = req.body;
      
      const result = await loginUser(email, password, mfaToken);
      
      // If MFA is required, return special response
      if (result.requiresMFA) {
        return res.json({
          success: true,
          data: {
            requiresMFA: true,
            message: 'MFA verification required',
          },
        });
      }
      
      res.json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
            displayName: result.user.displayName,
            avatar: result.user.avatar,
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Change password (authenticated)
router.post(
  '/change-password',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(z.object({
    body: z.object({
      currentPassword: z.string().min(6),
      newPassword: z.string().min(6),
    }),
  })),
  async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true },
      });

      if (!user || !user.passwordHash) {
        throw new AuthenticationError('Password change not available for this account');
      }

      const isValid = await verifyPassword(user.passwordHash, currentPassword);
      if (!isValid) {
        throw new AuthenticationError('Current password is incorrect');
      }

      const newHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      });

      res.json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Refresh access token
router.post(
  '/refresh',
  sanitizeInput,
  validate(refreshTokenSchema),
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      
      const userData = await verifyRefreshToken(refreshToken);
      
      const { accessToken, refreshToken: newRefreshToken } = generateTokens({
        id: userData.userId,
        email: userData.email,
        role: userData.role
      });
      
      // Store new refresh token
      await storeRefreshToken(userData.userId, newRefreshToken);
      
      // Revoke old refresh token
      await revokeRefreshToken(refreshToken);
      
      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Logout (revoke refresh token)
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Verify email
router.get('/verify-email/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    
    await verifyEmail(token);
    
    const redirectUrl = env.VERIFICATION_REDIRECT_URL || env.FRONTEND_URL;
    res.redirect(`${redirectUrl}?verified=true`);
  } catch (error) {
    next(error);
  }
});

// Forgot password
router.post(
  '/forgot-password',
  authRateLimiter,
  sanitizeInput,
  validate(forgotPasswordSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      
      const user = await prisma.user.findUnique({
        where: { email },
      });
      
      // Don't reveal if user exists (security best practice)
      if (user) {
        const resetToken = generatePasswordResetToken(user.id);
        
        // TODO: Send password reset email
        logger.info(`Password reset requested for: ${email}, token: ${resetToken}`);
      }
      
      res.json({
        success: true,
        message: 'If an account exists, a password reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Reset password
router.post(
  '/reset-password',
  authRateLimiter,
  sanitizeInput,
  validate(resetPasswordSchema),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      
      await resetPassword(token, newPassword);
      
      res.json({
        success: true,
        message: 'Password reset successful',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Google OAuth routes (only if configured)
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res, next) => {
      try {
        const user = req.user as any;
        const { accessToken, refreshToken } = await handleOAuthLogin(user);
        
        const redirectUrl = `${env.FRONTEND_URL}/auth/callback?token=${accessToken}&refresh=${refreshToken}`;
        res.redirect(redirectUrl);
      } catch (error) {
        next(error);
      }
    }
  );
}

// Twitter OAuth routes (only if configured)
if (env.TWITTER_CONSUMER_KEY && env.TWITTER_CONSUMER_SECRET) {
  router.get(
    '/twitter',
    passport.authenticate('twitter')
  );

  router.get(
    '/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    async (req, res, next) => {
      try {
        const user = req.user as any;
        const { accessToken, refreshToken } = await handleOAuthLogin(user);
      
        const redirectUrl = `${env.FRONTEND_URL}/auth/callback?token=${accessToken}&refresh=${refreshToken}`;
        res.redirect(redirectUrl);
      } catch (error) {
        next(error);
      }
    }
  );
}

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatar: true,
        role: true,
        bio: true,
        website: true,
        socialLinks: true,
        isVerified: true,
        createdAt: true,
      },
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

