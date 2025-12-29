#!/bin/bash

set -euo pipefail

echo "🚀 Starting ViralForge Marketplace (local dev)..."

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "📁 Project root: $PROJECT_ROOT"

# Detect WSL (for clearer messaging)
if grep -qi "microsoft" /proc/version 2>/dev/null; then
  echo "🐧 Detected WSL environment"
fi

echo "🔍 Checking Docker availability..."
if ! command -v docker >/dev/null 2>&1; then
  echo "❌ 'docker' command not found."
  echo "   Make sure Docker Desktop is installed and WSL integration is enabled."
  exit 1
fi

if ! docker ps >/dev/null 2>&1; then
  echo "❌ Docker is not running or not reachable from WSL."
  echo "   - Start Docker Desktop on Windows"
  echo "   - Ensure 'Use the WSL 2 based engine' and this distro are enabled in Docker settings"
  exit 1
fi

# Stop any old project containers to avoid port conflicts
echo "🧹 Cleaning up old project containers..."
docker compose down >/dev/null 2>&1 || true

# Also stop any backend API containers started via backend/docker-compose.yml
if [ -f "$PROJECT_ROOT/backend/docker-compose.yml" ]; then
  docker compose -f "$PROJECT_ROOT/backend/docker-compose.yml" down >/dev/null 2>&1 || true
fi

# Force remove any existing containers with our names (in case they weren't created by compose)
echo "🧹 Removing any existing containers with conflicting names..."
docker rm -f viralforge-db viralforge-redis viralforge-api viralforge-cron >/dev/null 2>&1 || true

# Always update backend dependencies to ensure package-lock.json is in sync
echo "📥 Updating backend dependencies (npm install in ./backend)..."
(cd backend && npm install)

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📥 Installing frontend dependencies (npm install in project root)..."
  npm install
else
  echo "✅ Frontend dependencies already installed."
fi

# Start all services (Postgres + Redis + Backend) using docker-compose
echo "📦 Starting all services with docker compose (Postgres, Redis, Backend)..."
docker compose up -d --build

echo "⏳ Waiting for services to initialize..."
sleep 8

echo "🐘 Checking PostgreSQL container health..."
if ! docker ps --format '{{.Names}}' | grep -q 'viralforge-db'; then
  echo "⚠️ Could not find 'viralforge-db' container. Listing running containers:"
  docker ps
else
  echo "✅ PostgreSQL container 'viralforge-db' is running."
fi

echo "🔧 Checking Backend container health..."
if ! docker ps --format '{{.Names}}' | grep -q 'viralforge-api'; then
  echo "⚠️ Could not find 'viralforge-api' container. Listing running containers:"
  docker ps
else
  echo "✅ Backend container 'viralforge-api' is running."
fi

# Wait for database to be ready before running migrations
echo "⏳ Waiting for database to be ready..."
for i in {1..30}; do
  if docker exec viralforge-db pg_isready -U viralforge >/dev/null 2>&1; then
    echo "✅ Database is ready"
    break
  fi
  sleep 1
done

# Run Prisma migrations inside the backend container (before backend starts)
echo "🗄️ Applying Prisma migrations (dev)..."
if docker exec viralforge-api npx prisma migrate dev --name init 2>&1; then
  echo "✅ Migrations applied successfully"
else
  echo "⚠️ Migration may have failed or already applied. Checking status..."
  docker exec viralforge-api npx prisma migrate status || true
fi

# Generate Prisma client if needed
echo "🔧 Generating Prisma client..."
docker exec viralforge-api npx prisma generate || echo "⚠️ Prisma generate failed (may already be generated)."

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
for i in {1..60}; do
  if docker exec viralforge-api node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" 2>/dev/null; then
    echo "✅ Backend is responding"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "⚠️ Backend is taking longer than expected. Checking logs..."
    docker logs --tail 20 viralforge-api
  fi
  sleep 2
done

# Wait for backend health endpoint from host
echo "⏳ Waiting for backend /health to respond on port 3001..."
for i in {1..30}; do
  if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:3001"
    echo "📚 API Docs: http://localhost:3001/api-docs"
    break
  fi
  sleep 1
done

if ! curl -s http://localhost:3001/health >/dev/null 2>&1; then
  echo "❌ Backend failed to start or /health is not reachable."
  echo "   Check the backend logs with: docker logs viralforge-api"
  exit 1
fi

# Start frontend (Vite) in foreground
echo "🎨 Starting frontend Vite dev server..."
echo ""
echo "================================"
echo "✅ ViralForge is starting!"
echo "================================"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo "API Docs: http://localhost:3001/api-docs"
echo ""
echo "Note:"
echo "- Backend is running in Docker container 'viralforge-api'"
echo "- To view backend logs: docker logs -f viralforge-api"
echo "- To stop all services: docker compose down"
echo "================================"
echo ""

npm run dev
