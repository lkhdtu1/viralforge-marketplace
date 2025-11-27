import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Environment variable validation schema
// OWASP: Input validation prevents configuration injection attacks
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().int().positive()),
  API_VERSION: z.string().default('v1'),
  
  DATABASE_URL: z.string().url(),
  
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  TWITTER_CONSUMER_KEY: z.string().optional(),
  TWITTER_CONSUMER_SECRET: z.string().optional(),
  TWITTER_CALLBACK_URL: z.string().url().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),
  APPLE_PRIVATE_KEY: z.string().optional(),
  
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).pipe(z.number().int()).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  REDIS_URL: z.string().url().optional(),
  
  ELASTICSEARCH_URL: z.string().url().optional(),
  ELASTICSEARCH_ENABLED: z.string().transform(val => val === 'true').default('false'),
  TYPESENSE_API_KEY: z.string().optional(),
  TYPESENSE_HOST: z.string().optional(),
  TYPESENSE_PORT: z.string().transform(Number).pipe(z.number().int()).optional(),
  TYPESENSE_PROTOCOL: z.enum(['http', 'https']).optional(),
  TYPESENSE_ENABLED: z.string().transform(val => val === 'true').default('false'),
  
  CORS_ORIGIN: z.string().default('*'),
  CSRF_ENABLED: z.string().transform(val => val === 'true').default('true'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().int()).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().int()).default('100'),
  
  FRONTEND_URL: z.string().url(),
  VERIFICATION_REDIRECT_URL: z.string().url().optional(),
  RESET_PASSWORD_REDIRECT_URL: z.string().url().optional(),
  
  VIRALITY_SCORE_BATCH_SIZE: z.string().transform(Number).pipe(z.number().int()).default('100'),
  VIRALITY_SCORE_INTERVAL_MS: z.string().transform(Number).pipe(z.number().int()).default('60000'),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export default env;

