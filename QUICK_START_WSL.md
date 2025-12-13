# Quick Start - WSL

## One-Command Start

```bash
# In WSL terminal, navigate to project:
cd /mnt/c/Users/LENOVO/Downloads/viral

# Make script executable (first time only)
chmod +x start-dev.sh

# Run the startup script
./start-dev.sh
```

That's it! The script handles everything:
- ✅ Docker containers (PostgreSQL, Redis, Backend)
- ✅ Database migrations (including new engagement tracking)
- ✅ Frontend dev server

## Access Your App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

## If Something Goes Wrong

### Check Docker
```bash
docker ps  # Should show viralforge-db, viralforge-api, viralforge-redis
```

### Check Logs
```bash
docker logs viralforge-api  # Backend logs
docker logs viralforge-db   # Database logs
```

### Restart Everything
```bash
docker compose down
./start-dev.sh
```

### Manual Migration (if needed)
```bash
docker exec viralforge-api npx prisma migrate dev
```

## New Features to Test

1. **Profile Picture Upload**: Go to Settings → Profile tab
2. **Analytics Dashboard**: Check `/analytics` for engagement metrics
3. **AI Growth Coach**: Look for the floating AI coach widget
4. **Engagement Tracking**: Automatically tracks your activity

## Stop Services

Press `Ctrl+C` to stop frontend, then:
```bash
docker compose down
```

