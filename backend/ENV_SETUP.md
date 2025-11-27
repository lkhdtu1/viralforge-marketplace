# Environment Variables Setup

Since `.env.example` creation was blocked, here's the complete environment variable template:

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/viralforge?schema=public

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_CALLBACK_URL=http://localhost:3001/api/v1/auth/twitter/callback
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email Configuration (Optional - for verification/reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@viralforge.com

# Redis Configuration (Optional - for rate limiting, queues)
REDIS_URL=redis://localhost:6379

# Search Configuration (Optional)
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_ENABLED=false
TYPESENSE_API_KEY=your-typesense-api-key
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_ENABLED=false

# Security
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
CSRF_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URLs
FRONTEND_URL=http://localhost:5173
VERIFICATION_REDIRECT_URL=http://localhost:5173/auth/verify
RESET_PASSWORD_REDIRECT_URL=http://localhost:5173/auth/reset-password

# Virality Score Configuration
VIRALITY_SCORE_BATCH_SIZE=100
VIRALITY_SCORE_INTERVAL_MS=60000
```

## Quick Setup

1. Copy the content above into a new `.env` file
2. Update the required variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Generate a secure random string (min 32 chars)
   - `JWT_REFRESH_SECRET`: Another secure random string (min 32 chars)
   - `STRIPE_SECRET_KEY`: Your Stripe test/live key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `FRONTEND_URL`: Your frontend URL

## Generating Secure Secrets

```bash
# Generate JWT secrets (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Stripe Setup

1. Sign up at https://stripe.com
2. Get your API keys from the dashboard
3. For webhooks, use Stripe CLI locally:
   ```bash
   stripe listen --forward-to localhost:3001/api/v1/webhooks/stripe
   ```

