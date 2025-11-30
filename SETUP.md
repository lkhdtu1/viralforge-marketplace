# ViralForge Marketplace - Setup Guide

## Overview

ViralForge is a marketplace platform connecting brands with content creators for influencer marketing campaigns. This is a full-stack application with:

- **Frontend**: React + TypeScript + Vite + shadcn/ui
- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Infrastructure**: Docker for databases

## Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose
- Git

## Quick Start

### 1. Start Databases

```bash
# Start PostgreSQL and Redis with Docker
sudo docker compose up -d

# Verify containers are running
sudo docker ps
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies (if not already done)
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run db:seed

# Start backend server
npm run dev
```

Backend will start on **http://localhost:3001**

### 3. Setup Frontend

```bash
# From project root
cd ..

# Install dependencies (if not already done)
npm install

# Start frontend development server
npm run dev
```

Frontend will start on **http://localhost:5173**

## Project Structure

```
viralforge-marketplace/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities
│   │   ├── workers/        # Background workers
│   │   └── server.ts       # Main server file
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── .env                # Backend environment variables
│   └── package.json
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and API client
│   ├── types/              # TypeScript types
│   └── App.tsx
├── docker-compose.yml      # Docker services
├── .env                    # Frontend environment variables
└── package.json
```

## Features

### Core Features
- ✅ User authentication (JWT-based)
- ✅ Role-based access control (Brand, Creator, Admin)
- ✅ Campaign management
- ✅ Creator marketplace
- ✅ Messaging system
- ✅ Analytics dashboard
- ✅ Escrow payment system (Stripe integration ready)
- ✅ Search functionality
- ✅ Admin panel

### Frontend Pages
- Landing page with pricing
- Authentication (login/signup)
- Dashboard with analytics
- Campaign builder
- Marketplace (browse creators)
- Creator profiles
- Messages
- Settings
- About & Legal pages

### Backend API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

#### Campaigns
- `POST /api/v1/campaigns` - Create campaign
- `GET /api/v1/campaigns` - List campaigns
- `GET /api/v1/campaigns/:id` - Get campaign details
- `PUT /api/v1/campaigns/:id` - Update campaign
- `DELETE /api/v1/campaigns/:id` - Delete campaign

#### Marketplace
- `POST /api/v1/marketplace` - Create listing
- `GET /api/v1/marketplace` - Browse listings
- `GET /api/v1/marketplace/:id` - Get listing details

#### Messages
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages` - Get inbox
- `PATCH /api/v1/messages/mark-read` - Mark as read

#### Analytics
- `POST /api/v1/analytics/events` - Track event
- `GET /api/v1/analytics/me` - Get user analytics

#### Admin
- `GET /api/v1/admin/disputes` - List disputes
- `POST /api/v1/admin/disputes/resolve` - Resolve dispute
- `GET /api/v1/admin/stats` - Platform statistics

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## Environment Variables

### Backend (.env in backend/)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://viralforge:viralforge123@localhost:5432/viralforge
JWT_SECRET=dev-jwt-secret-key-change-in-production-min-32-characters-long
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-min-32-characters-long
STRIPE_SECRET_KEY=sk_test_51MockKeyForDevelopmentPurposesOnly123456789
STRIPE_PUBLISHABLE_KEY=pk_test_51MockKeyForDevelopmentPurposesOnly123456789
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Frontend (.env in root/)
```env
VITE_API_URL=http://localhost:3001/api/v1
```

## Database

### Schema Overview
- **User**: Users with roles (BRAND, CREATOR, ADMIN)
- **Campaign**: Brand campaigns
- **Listing**: Creator listings/offers
- **Contract**: Agreements between brands and creators
- **Escrow**: Secure payment escrow
- **Transaction**: Payment history
- **Message**: Brand-creator messaging
- **AnalyticsEvent**: User analytics events
- **ViralityScoreHistory**: Creator virality scores

### Database Commands

```bash
cd backend

# Open Prisma Studio (GUI for database)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database with sample data
npm run db:seed
```

## Docker Commands

```bash
# Start all services
sudo docker compose up -d

# Stop all services
sudo docker compose down

# View logs
sudo docker compose logs -f

# Stop and remove volumes (deletes data)
sudo docker compose down -v

# Restart a specific service
sudo docker compose restart postgres
```

## Development Workflow

### Running Both Frontend and Backend

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - Database (if needed):**
```bash
cd backend
npm run prisma:studio
```

### Testing the API

```bash
# Health check
curl http://localhost:3001/health

# Register a new user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"CREATOR"}'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
npm run build
npm run preview
```

## Docker Deployment

### Build Backend Image
```bash
cd backend
docker build -t viralforge-backend .
```

### Run with Docker Compose
```bash
# Production mode
docker compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running: `sudo docker ps`
- Check database connection: `cd backend && npm run prisma:studio`
- Check logs: `cat /tmp/backend.log`

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:3001/health`
- Check `.env` file has correct `VITE_API_URL`
- Check browser console for CORS errors

### Database connection errors
- Ensure Docker containers are running
- Check `DATABASE_URL` in `backend/.env`
- Try restarting containers: `sudo docker compose restart`

### Port already in use
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

## Security Notes

⚠️ **Important for Production:**

1. Change all secret keys in `.env` files
2. Use real Stripe API keys (not mock keys)
3. Set up OAuth credentials for Google/Twitter login
4. Enable HTTPS
5. Set `NODE_ENV=production`
6. Use strong database passwords
7. Enable rate limiting
8. Set up proper CORS origins

## Next Steps

1. **Set up real Stripe account** for payments
2. **Configure OAuth providers** (Google, Twitter, Apple)
3. **Set up email service** (SMTP) for verification emails
4. **Add Redis** for caching and queues
5. **Deploy to cloud** (AWS, Render, Fly.io)
6. **Set up CI/CD** pipeline
7. **Add monitoring** (Sentry, LogRocket)
8. **Implement file uploads** for creator portfolios

## Support

For issues and questions:
- Check the backend README: `backend/README.md`
- Check API documentation: http://localhost:3001/api-docs
- Review deployment guide: `backend/DEPLOYMENT.md`

## License

MIT
