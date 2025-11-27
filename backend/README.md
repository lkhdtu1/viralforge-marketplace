# ViralForge Backend API

A secure, production-ready Node.js + TypeScript + Express backend for the ViralForge marketplace platform.

## Features

- 🔐 **Authentication**: JWT + Refresh tokens, OAuth (Google, Twitter, Apple), email verification, password reset
- 💳 **Payments**: Stripe integration with escrow state machine
- 🛡️ **Security**: RBAC, input validation, CORS, Helmet, CSRF protection, rate limiting
- 🔍 **Search**: PostgreSQL full-text search + optional Elasticsearch/Typesense
- 📊 **Analytics**: Event ingestion with Virality Score computation
- 👥 **Admin**: Dispute resolution and manual payout APIs
- 🐳 **Docker**: Complete Docker setup for local development
- ☁️ **Deployment**: Terraform configs for Fly.io, Render.com

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis with BullMQ
- **Payments**: Stripe
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional, for local dev)

## Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT tokens (min 32 chars)
- `JWT_REFRESH_SECRET`: Secret for refresh tokens (min 32 chars)
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `FRONTEND_URL`: Your frontend URL

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

## Docker Development

### Using Docker Compose

```bash
# Start all services (PostgreSQL, Redis, API)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t viralforge-backend .

# Run container
docker run -p 3001:3001 --env-file .env viralforge-backend
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3001/api-docs
- **OpenAPI JSON**: http://localhost:3001/api-docs.json

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout (revoke token)
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/google` - Google OAuth
- `GET /api/v1/auth/twitter` - Twitter OAuth
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/profile` - Update own profile
- `GET /api/v1/users/:id/campaigns` - Get user's campaigns
- `GET /api/v1/users/:id/listings` - Get user's listings

### Campaigns
- `POST /api/v1/campaigns` - Create campaign (brand)
- `GET /api/v1/campaigns` - List campaigns
- `GET /api/v1/campaigns/:id` - Get campaign details
- `PUT /api/v1/campaigns/:id` - Update campaign
- `DELETE /api/v1/campaigns/:id` - Delete campaign

### Marketplace
- `POST /api/v1/marketplace` - Create listing (creator)
- `GET /api/v1/marketplace` - Browse listings
- `GET /api/v1/marketplace/:id` - Get listing details
- `PUT /api/v1/marketplace/:id` - Update listing
- `DELETE /api/v1/marketplace/:id` - Delete listing

### Escrow & Payments
- `POST /api/v1/escrow` - Create escrow
- `GET /api/v1/escrow/:id` - Get escrow details
- `POST /api/v1/escrow/:id/payment-intent` - Create payment intent
- `PATCH /api/v1/escrow/:id/status` - Update escrow status
- `POST /api/v1/escrow/:id/release` - Release funds
- `POST /api/v1/escrow/:id/refund` - Refund funds
- `POST /api/v1/checkout` - Create checkout session

### Messages
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages` - Get inbox
- `GET /api/v1/messages/sent` - Get sent messages
- `GET /api/v1/messages/:id` - Get message
- `PATCH /api/v1/messages/mark-read` - Mark as read
- `DELETE /api/v1/messages/:id` - Delete message

### Analytics
- `POST /api/v1/analytics/events` - Track event
- `POST /api/v1/analytics/events/batch` - Track batch events
- `GET /api/v1/analytics/me` - Get user analytics

### Search
- `GET /api/v1/search?q=query&type=listings` - Search listings/campaigns

### Admin
- `GET /api/v1/admin/disputes` - List disputes
- `POST /api/v1/admin/disputes/resolve` - Resolve dispute
- `POST /api/v1/admin/payouts/manual` - Manual payout
- `PATCH /api/v1/admin/users/:id/status` - Update user status
- `GET /api/v1/admin/stats` - Platform statistics

### Webhooks
- `POST /api/v1/webhooks/stripe` - Stripe webhook handler

## Database Schema

### Models

- **User**: Users with roles (BRAND, CREATOR, ADMIN)
- **Campaign**: Brand campaigns
- **Listing**: Creator listings/offers
- **Contract**: Agreements between brands and creators
- **Escrow**: Secure payment escrow with state machine
- **Transaction**: Payment history
- **Message**: Brand-creator messaging
- **AnalyticsEvent**: User analytics events
- **ViralityScoreHistory**: Creator virality scores
- **CookieConsent**: GDPR cookie consent tracking

### Escrow State Machine

```
CREATED → FUNDED → IN_PROGRESS → COMPLETED → RELEASED
   ↓         ↓           ↓            ↓
REFUNDED ← REFUNDED ← REFUNDED ← REFUNDED
```

## Security Features

### OWASP Top 10 Mitigations

1. **Injection Prevention**: Parameterized queries (Prisma), input validation (Zod)
2. **Broken Authentication**: JWT with refresh tokens, Argon2 password hashing
3. **Sensitive Data Exposure**: Environment variables, encrypted connections
4. **XML External Entities**: Not applicable (JSON only)
5. **Broken Access Control**: RBAC middleware, resource ownership checks
6. **Security Misconfiguration**: Helmet, CORS, security headers
7. **XSS Prevention**: Input sanitization, CSP headers
8. **Insecure Deserialization**: JSON validation with Zod
9. **Using Components with Known Vulnerabilities**: Regular dependency updates
10. **Insufficient Logging**: Winston logging, security event logging

### Additional Security

- Rate limiting (express-rate-limit)
- CSRF protection (csurf)
- Request size limits
- Input sanitization
- SQL injection prevention (Prisma)
- XSS prevention
- Secure headers (Helmet)

## Virality Score Algorithm

The Virality Score combines three metrics:

1. **Share Rate (40%)**: `(shares / views) * 100`
2. **Engagement Per User (40%)**: `(engagements / unique_users) * 100`
3. **Velocity (20%)**: Growth rate of recent vs previous engagements

Final Score = `(SR * 0.4) + (EPU * 0.4) + (V * 0.2)`

Computed daily via BullMQ worker.

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Deployment

### Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Deploy: See `terraform/README.md`

### Render.com

1. Connect GitHub repository
2. Use `render.yaml` configuration
3. Set environment variables in dashboard

### Railway.app

1. Connect GitHub repository
2. Railway auto-detects and deploys
3. Set environment variables

## Environment Variables

See `.env.example` for all available environment variables.

### Required
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `FRONTEND_URL`

### Optional
- `REDIS_URL` (for rate limiting and queues)
- `ELASTICSEARCH_URL` (for advanced search)
- `TYPESENSE_*` (for Typesense search)
- OAuth credentials (Google, Twitter, Apple)
- SMTP credentials (for email)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:deploy` - Deploy migrations (production)
- `npm run prisma:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utilities
│   ├── workers/         # Background workers
│   ├── __tests__/       # Tests
│   └── server.ts        # Main server file
├── prisma/
│   └── schema.prisma   # Database schema
├── terraform/          # Infrastructure as code
├── docker-compose.yml  # Local development
├── Dockerfile          # Production image
└── package.json
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

