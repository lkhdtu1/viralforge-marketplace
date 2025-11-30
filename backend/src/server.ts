import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import env from './config/env';
import logger from './utils/logger';
import { errorHandler } from './utils/errors';
import {
  helmetMiddleware,
  corsMiddleware,
  rateLimiter,
  securityHeaders,
  requestSizeLimiter,
} from './middleware/security';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import campaignRoutes from './routes/campaigns.routes';
import marketplaceRoutes from './routes/marketplace.routes';
import escrowRoutes from './routes/escrow.routes';
import checkoutRoutes from './routes/checkout.routes';
import messageRoutes from './routes/messages.routes';
import analyticsRoutes from './routes/analytics.routes';
import searchRoutes from './routes/search.routes';
import adminRoutes from './routes/admin.routes';
import webhookRoutes from './routes/webhooks.routes';

// Swagger/OpenAPI setup
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app: Express = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ViralForge API',
      version: '1.0.0',
      description: 'Secure backend API for ViralForge marketplace - connecting brands with content creators',
      contact: {
        name: 'API Support',
        email: 'support@viralforge.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
      {
        url: 'https://api.viralforge.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Campaigns',
        description: 'Brand campaign management',
      },
      {
        name: 'Marketplace',
        description: 'Creator marketplace and listings',
      },
      {
        name: 'Analytics',
        description: 'Campaign analytics and metrics',
      },
      {
        name: 'Messages',
        description: 'Direct messaging between brands and creators',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['CREATOR', 'BRAND', 'ADMIN'] },
            displayName: { type: 'string' },
          },
        },
        Campaign: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            budget: { type: 'number' },
            status: { type: 'string', enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'] },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
// OWASP: Security headers and CORS must be applied first
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(securityHeaders);
app.use(requestSizeLimiter);

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

// Body parsing
// Note: Stripe webhooks need raw body, so we handle that route separately
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API routes
const apiRouter = express.Router();

// Webhook routes (needs raw body - handle separately)
// Note: Stripe webhooks require raw body for signature verification
const webhookRouter = express.Router();
webhookRouter.use(express.raw({ type: 'application/json' }));
webhookRouter.use('/', webhookRoutes);
apiRouter.use('/webhooks', webhookRouter);

// Regular API routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/campaigns', campaignRoutes);
apiRouter.use('/marketplace', marketplaceRoutes);
apiRouter.use('/escrow', escrowRoutes);
apiRouter.use('/checkout', checkoutRoutes);
apiRouter.use('/messages', messageRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/search', searchRoutes);
apiRouter.use('/admin', adminRoutes);

app.use(`/api/${env.API_VERSION}`, apiRouter);

// Global rate limiter
app.use(rateLimiter);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.path,
    },
  });
});

// Start server
const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
  logger.info(`🌍 Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;

