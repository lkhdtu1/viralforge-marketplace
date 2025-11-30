# ViralForge - Quick Reference Card

## 🚀 Start Everything
```bash
./start-dev.sh
```

## 📍 URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs
- **Health**: http://localhost:3001/health

## 🐳 Docker Commands
```bash
# Start databases
sudo docker compose up -d

# Stop databases
sudo docker compose down

# View logs
sudo docker compose logs -f

# Restart
sudo docker compose restart
```

## 🔧 Backend Commands
```bash
cd backend

# Start dev server
npm run dev

# Database GUI
npm run prisma:studio

# Run migrations
npm run prisma:migrate

# Seed database
npm run db:seed

# Build for production
npm run build
```

## 🎨 Frontend Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Test API
```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","role":"CREATOR"}'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
```

## 📊 Database Access
```bash
# Open Prisma Studio
cd backend && npm run prisma:studio

# Direct PostgreSQL access
sudo docker exec -it viralforge-db psql -U viralforge -d viralforge

# View tables
\dt

# View users
SELECT * FROM users;

# Exit
\q
```

## 🔍 Debugging
```bash
# Backend logs
tail -f /tmp/viralforge-backend.log

# Check if port is in use
lsof -i :3001

# Kill process on port
kill -9 $(lsof -t -i:3001)

# Check Docker containers
sudo docker ps

# Check container logs
sudo docker logs viralforge-db
sudo docker logs viralforge-redis
```

## 📁 Important Files
- `backend/.env` - Backend configuration
- `.env` - Frontend configuration
- `backend/prisma/schema.prisma` - Database schema
- `src/lib/api.ts` - Frontend API client
- `backend/src/routes/` - API endpoints

## 🔑 Default Test User
After running `npm run db:seed` in backend:
- **Email**: demo@viralforge.com
- **Password**: Demo123!
- **Role**: CREATOR

## 🛠️ Common Issues

### Backend won't start
```bash
# Check database
sudo docker ps
# Restart database
sudo docker compose restart postgres
```

### Port already in use
```bash
# Kill process
pkill -f "tsx watch src/server.ts"
```

### Database connection error
```bash
# Check DATABASE_URL in backend/.env
# Restart containers
sudo docker compose down && sudo docker compose up -d
```

### Frontend can't connect
```bash
# Check VITE_API_URL in .env
# Verify backend is running
curl http://localhost:3001/health
```

## 📦 Project Structure
```
viralforge-marketplace/
├── backend/          # Node.js API
├── src/              # React frontend
├── docker-compose.yml
├── SETUP.md          # Full setup guide
├── PROJECT_SUMMARY.md # Project overview
└── start-dev.sh      # Quick start script
```

## 🎯 For Demo/Presentation
1. Start with `./start-dev.sh`
2. Open http://localhost:5173
3. Show landing page
4. Register/login
5. Create campaign
6. Browse marketplace
7. Show analytics
8. Show API docs at http://localhost:3001/api-docs

## 📚 Documentation
- **Setup**: `SETUP.md`
- **Project Overview**: `PROJECT_SUMMARY.md`
- **Backend API**: `backend/README.md`
- **Deployment**: `backend/DEPLOYMENT.md`
- **API Docs**: http://localhost:3001/api-docs

## 🔐 Security Notes
- Change JWT secrets before production
- Use real Stripe keys for payments
- Set up OAuth credentials
- Enable HTTPS in production
- Use strong database passwords

## 💡 Quick Tips
- Use Prisma Studio for easy database viewing
- Check Swagger docs for API testing
- Use browser DevTools Network tab to debug API calls
- Backend auto-reloads on file changes
- Frontend has hot module replacement

---
**Need Help?** Check `SETUP.md` for detailed instructions
