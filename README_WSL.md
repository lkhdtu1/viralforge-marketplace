# 🚀 Running ViralForge in WSL with Docker

## Quick Start

```bash
# 1. Open WSL terminal
# 2. Navigate to project
cd /mnt/c/Users/LENOVO/Downloads/viral

# 3. Make script executable (first time only)
chmod +x start-dev.sh

# 4. Run the startup script
./start-dev.sh
```

## What the Script Does

The `start-dev.sh` script automatically:

1. ✅ Checks Docker availability
2. ✅ Cleans up old containers
3. ✅ Installs dependencies
4. ✅ Starts Docker services:
   - PostgreSQL (port 5433)
   - Redis (port 6379)
   - Backend API (port 3001)
5. ✅ Runs database migrations (including new engagement tracking)
6. ✅ Starts frontend dev server (port 5173)

## Access Points

Once running:
- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:3001
- 📚 **API Docs**: http://localhost:3001/api-docs
- ❤️ **Health Check**: http://localhost:3001/health

## Prerequisites

- ✅ WSL 2 installed
- ✅ Docker Desktop installed on Windows
- ✅ WSL integration enabled in Docker Desktop

### Enable WSL Integration

1. Open Docker Desktop
2. Go to Settings → Resources → WSL Integration
3. Enable your WSL distro (Ubuntu)
4. Click "Apply & Restart"

## Troubleshooting

### Docker Not Found
```bash
# Make sure Docker Desktop is running on Windows
# Check: Docker Desktop → Settings → General → Use the WSL 2 based engine
```

### Port Conflicts
```bash
# Stop existing containers
docker compose down

# Or stop specific containers
docker stop viralforge-db viralforge-api viralforge-redis
```

### View Logs
```bash
# Backend logs
docker logs -f viralforge-api

# All services
docker compose logs -f
```

### Database Issues
```bash
# Check database connection
docker exec viralforge-db pg_isready -U viralforge

# Run migrations manually
docker exec viralforge-api npx prisma migrate dev

# Access database
docker exec -it viralforge-db psql -U viralforge -d viralforge
```

## New Features Available

After running the script, you'll have access to:

1. **Profile Picture Upload** - Settings → Profile tab
2. **Avatar Selection** - Choose from emoji avatars
3. **Engagement Tracking** - Automatic tracking of logins, usage, clicks
4. **Analytics Dashboard** - View your engagement metrics
5. **AI Growth Coach** - Interactive AI assistant
6. **3D Image Effects** - Hover effects on images

## Stop Services

```bash
# Stop frontend: Press Ctrl+C in terminal

# Stop Docker services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

## File Structure

```
viral/
├── docker-compose.yml          # Main docker-compose config
├── start-dev.sh                # Startup script
├── backend/
│   ├── uploads/                # File uploads (created automatically)
│   │   └── avatars/            # Profile pictures
│   └── prisma/
│       └── migrations/         # Database migrations
└── src/                        # Frontend code
```

## Database Migration

The new engagement tracking fields are automatically added when you run `./start-dev.sh`. The migration includes:
- `loginCount` - Total logins
- `dailyUsageMinutes` - Daily usage time
- `totalClicks` - Total clicks tracked
- `streakDays` - Consecutive days
- `lastActiveAt` - Last activity timestamp

## Next Steps

1. ✅ Run `./start-dev.sh`
2. ✅ Wait for services to start (~30 seconds)
3. ✅ Open http://localhost:5173
4. ✅ Create an account or login
5. ✅ Test the new features!

## Need Help?

- Check `WSL_SETUP_GUIDE.md` for detailed setup
- Check `PRODUCTION_READINESS.md` for production deployment
- Check backend logs: `docker logs viralforge-api`
- Check frontend console in browser DevTools

