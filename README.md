# ViralForge Marketplace

A marketplace platform connecting brands with content creators for influencer marketing campaigns.

## What is ViralForge?

ViralForge is a full-stack marketplace where:
- **Brands** create campaigns and hire content creators
- **Creators** offer services and apply to campaigns
- **Platform** handles contracts, payments, and messaging

Think Upwork/Fiverr but specifically for influencer marketing.

## Features

- 🔐 Authentication with role-based access (Brand/Creator)
- 🔍 Discovery system to browse creators and services
- 🛒 Shopping cart and checkout
- 📝 Campaign creation and applications
- 💬 Real-time messaging
- 📊 Contract and order management
- 💰 Escrow payment system (ready for Stripe)
- 🎨 Modern UI with shadcn/ui components

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Query

**Backend:**
- Node.js 20 + Express
- Prisma ORM
- PostgreSQL
- JWT authentication

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm or bun

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd viralforge-marketplace
```

2. **Start databases**
```bash
sudo docker compose up -d
```

3. **Setup backend**
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

4. **Setup frontend** (new terminal)
```bash
npm install
npm run dev
```

5. **Access the app**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

### Quick Start Script

Or use the automated script:
```bash
./start-dev.sh
```

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://viralforge:viralforge@localhost:5432/viralforge"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=3001
NODE_ENV=development
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001
```

## Project Structure

```
viralforge-marketplace/
├── backend/              # Express API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, validation
│   │   └── server.ts    # Main server
│   └── prisma/          # Database schema
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── pages/          # Page components
│   └── lib/            # API client
└── docker-compose.yml   # PostgreSQL + Redis
```

## Usage

### As a Creator
1. Register with role "Creator"
2. Go to Dashboard → "Manage Listings"
3. Create service listings (e.g., "Instagram Post - $250")
4. Browse campaigns and apply
5. Manage contracts in Orders page

### As a Brand
1. Register with role "Brand"
2. Browse `/discover` to find creators/services
3. Add services to cart and checkout
4. Or create campaigns and review applications
5. Track contracts in Orders page

## API Documentation

Full API documentation available at http://localhost:3001/api-docs when running.

Key endpoints:
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/marketplace` - Browse services
- `POST /api/v1/contracts` - Create contract
- `GET /api/v1/messages/conversations` - Get messages

## Database

PostgreSQL database with tables:
- `users` - User accounts
- `campaigns` - Brand campaigns
- `listings` - Creator services
- `contracts` - Orders/applications
- `messages` - Direct messaging
- `escrows` - Payment escrow

View database:
```bash
cd backend
npm run prisma:studio
```

## Development

### Backend
```bash
cd backend
npm run dev          # Start dev server
npm run build        # Build for production
npm run prisma:studio # Open database GUI
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Testing

1. Register two accounts (one Brand, one Creator)
2. As Creator: Create a listing
3. As Brand: Browse `/discover`, add to cart, checkout
4. Test messaging between accounts
5. Test campaign application flow

## Deployment

Ready for deployment to:
- **Frontend:** Vercel, Netlify
- **Backend:** Render, Fly.io, AWS
- **Database:** Managed PostgreSQL (Supabase, Neon, etc.)

See `backend/DEPLOYMENT.md` for detailed instructions.

## Documentation

- **Project Status:** `PROJECT_STATUS.md` - Complete feature overview
- **Setup Guide:** `SETUP.md` - Detailed setup instructions
- **Backend Docs:** `backend/README.md` - API documentation

## License

MIT

## Support

For issues or questions, check the documentation or open an issue on GitHub.
