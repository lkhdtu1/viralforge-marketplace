# WSL Setup Guide for ViralForge

## Prerequisites

1. **WSL 2** installed and running
2. **Docker Desktop** installed on Windows with WSL integration enabled
3. **Node.js** (will be installed in Docker containers)

## Step 1: Open WSL Terminal

Open your WSL terminal (Ubuntu or your preferred distro).

## Step 2: Navigate to Project Directory

```bash
cd /mnt/c/Users/LENOVO/Downloads/viral
```

Or if you're already in the project:
```bash
pwd  # Verify you're in the right directory
```

## Step 3: Make Script Executable

```bash
chmod +x start-dev.sh
```

## Step 4: Verify Docker is Running

```bash
# Check if Docker is accessible from WSL
docker ps

# If you get an error, make sure:
# 1. Docker Desktop is running on Windows
# 2. WSL integration is enabled in Docker Desktop settings
# 3. Your WSL distro is enabled in Docker Desktop > Settings > Resources > WSL Integration
```

## Step 5: Run the Startup Script

```bash
./start-dev.sh
```

The script will:
1. ✅ Check Docker availability
2. ✅ Clean up old containers
3. ✅ Install dependencies
4. ✅ Start PostgreSQL, Redis, and Backend containers
5. ✅ Run database migrations (including the new engagement tracking fields)
6. ✅ Start the frontend dev server

## What to Expect

You should see output like:
```
🚀 Starting ViralForge Marketplace (local dev)...
📁 Project root: /mnt/c/Users/LENOVO/Downloads/viral
🐧 Detected WSL environment
🔍 Checking Docker availability...
✅ Docker is accessible
📦 Starting all services with docker compose...
✅ PostgreSQL container 'viralforge-db' is running.
✅ Backend container 'viralforge-api' is running.
🗄️ Applying Prisma migrations...
✅ Migrations applied successfully
✅ Backend is running on http://localhost:3001
🎨 Starting frontend Vite dev server...
```

## Access Points

Once running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## Troubleshooting

### Docker Not Found
```bash
# Make sure Docker Desktop is running on Windows
# Check WSL integration in Docker Desktop settings
```

### Port Already in Use
```bash
# Stop existing containers
docker compose down

# Or stop specific containers
docker stop viralforge-db viralforge-api viralforge-redis
docker rm viralforge-db viralforge-api viralforge-redis
```

### Migration Fails
```bash
# Check backend logs
docker logs viralforge-api

# Manually run migration
docker exec viralforge-api npx prisma migrate dev
```

### Backend Not Starting
```bash
# Check logs
docker logs -f viralforge-api

# Check if database is ready
docker exec viralforge-db pg_isready -U viralforge
```

### Frontend Not Starting
```bash
# Make sure you're in the project root
cd /mnt/c/Users/LENOVO/Downloads/viral

# Install dependencies manually if needed
npm install

# Start frontend manually
npm run dev
```

## Useful Commands

### View Logs
```bash
# Backend logs
docker logs -f viralforge-api

# Database logs
docker logs -f viralforge-db

# All services
docker compose logs -f
```

### Stop Services
```bash
# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

### Restart Services
```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend
```

### Access Database
```bash
# Connect to PostgreSQL
docker exec -it viralforge-db psql -U viralforge -d viralforge

# Or use Prisma Studio
docker exec -it viralforge-api npx prisma studio
# Then access at http://localhost:5555 (if port is exposed)
```

### Check Container Status
```bash
docker ps
docker compose ps
```

## Database Migration

The new engagement tracking fields will be automatically applied when you run `./start-dev.sh`. The migration file is located at:
```
backend/prisma/migrations/add_user_engagement_tracking/migration.sql
```

If you need to manually run migrations:
```bash
docker exec viralforge-api npx prisma migrate dev
```

## File Uploads

Uploaded avatars will be stored in:
```
backend/uploads/avatars/
```

This directory is mounted as a volume in docker-compose.yml, so files persist between container restarts.

## Next Steps

1. ✅ Run `./start-dev.sh` in WSL
2. ✅ Wait for all services to start
3. ✅ Open http://localhost:5173 in your browser
4. ✅ Test the new features:
   - Profile picture upload
   - Analytics dashboard
   - AI Growth Coach
   - Engagement tracking

## Notes

- The script uses the root `docker-compose.yml` file
- Backend runs in Docker container `viralforge-api`
- Database runs in Docker container `viralforge-db`
- Frontend runs directly on your WSL host (not in Docker)
- All services communicate through Docker network `viralforge-network`

