# Deployment Guide

This guide covers deploying ViralForge backend to various platforms.

## Prerequisites

- Database: PostgreSQL 16+
- Cache/Queue: Redis 7+ (optional but recommended)
- Environment variables configured

## Local Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset database
docker-compose down -v
docker-compose up -d
npm run prisma:migrate
```

## Fly.io Deployment

### 1. Install Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Login

```bash
fly auth login
```

### 3. Initialize App

```bash
fly launch
```

### 4. Set Secrets

```bash
fly secrets set JWT_SECRET=your-secret
fly secrets set JWT_REFRESH_SECRET=your-secret
fly secrets set STRIPE_SECRET_KEY=sk_live_xxx
fly secrets set STRIPE_PUBLISHABLE_KEY=pk_live_xxx
fly secrets set DATABASE_URL=postgresql://...
```

### 5. Deploy

```bash
fly deploy
```

### 6. Run Migrations

```bash
fly ssh console
npm run prisma:deploy
```

## Render.com Deployment

1. Connect your GitHub repository
2. Create a new Web Service
3. Use the `render.yaml` configuration
4. Set environment variables in the dashboard
5. Deploy automatically on push

## Railway.app Deployment

1. Connect your GitHub repository
2. Railway auto-detects Node.js
3. Set environment variables
4. Deploy automatically

## Environment Variables for Production

### Required

- `NODE_ENV=production`
- `DATABASE_URL` - Production PostgreSQL URL
- `JWT_SECRET` - Secure random string (32+ chars)
- `JWT_REFRESH_SECRET` - Secure random string (32+ chars)
- `STRIPE_SECRET_KEY` - Stripe live key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - From Stripe dashboard
- `FRONTEND_URL` - Your frontend domain
- `CORS_ORIGIN` - Allowed origins (comma-separated)

### Recommended

- `REDIS_URL` - For rate limiting and queues
- `SMTP_*` - For email functionality
- OAuth credentials if using social login

## Database Migrations

### Development

```bash
npm run prisma:migrate
```

### Production

```bash
npm run prisma:deploy
```

## Health Checks

All platforms should monitor:
- `GET /health` - Returns 200 if healthy

## Webhook Configuration

### Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-api.com/api/v1/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Monitoring

### Logs

- Application logs: Check platform logs
- Security logs: `logs/security.log`
- Error logs: `logs/error.log`

### Metrics to Monitor

- API response times
- Error rates
- Database connection pool
- Redis connection
- Stripe webhook processing

## Scaling

### Horizontal Scaling

- Stateless API: Can scale horizontally
- Use shared Redis for rate limiting
- Use connection pooling for database

### Vertical Scaling

- Increase memory for large payloads
- Increase CPU for compute-intensive tasks

## Security Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Webhook signatures verified
- [ ] Logs don't contain sensitive data
- [ ] Dependencies up to date

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check Prisma connection
npm run prisma:studio
```

### Redis Connection Issues

```bash
# Test connection
redis-cli -u $REDIS_URL ping
```

### Stripe Webhook Issues

```bash
# Test locally with Stripe CLI
stripe listen --forward-to localhost:3001/api/v1/webhooks/stripe
```

## Backup Strategy

1. **Database**: Automated daily backups
2. **Environment Variables**: Store in secure vault
3. **Code**: Version control (Git)

## Rollback Procedure

1. Revert code to previous version
2. Run database migrations if needed
3. Restart services
4. Verify health check

