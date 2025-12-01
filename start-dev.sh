#!/bin/bash

# ViralForge Development Startup Script

echo "🚀 Starting ViralForge Marketplace..."

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start databases
echo "📦 Starting databases..."
sudo docker compose up -d

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 5

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
fi

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm run dev > /tmp/viralforge-backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
for i in {1..20}; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend is running on http://localhost:3001"
        echo "📚 API Docs: http://localhost:3001/api-docs"
        break
    fi
    sleep 1
done

# Start frontend
echo "🎨 Starting frontend server..."
echo ""
echo "================================"
echo "✅ ViralForge is starting!"
echo "================================"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo "API Docs: http://localhost:3001/api-docs"
echo "================================"
echo ""

npm run dev
