#!/bin/bash

echo "🔧 Walter Braun - VPS Permission Fix"
echo "===================================="

# Stop containers first
echo "🔄 Stopping containers..."
docker compose down

# Create data directory with correct permissions
echo "📁 Creating data directory with proper permissions..."
sudo mkdir -p ./data
sudo chmod 755 ./data
sudo chown -R 1000:1000 ./data

# Also create the directory inside the container volume
echo "📁 Setting up Docker volume permissions..."
if [ ! -d "/var/lib/docker/volumes" ]; then
    echo "⚠️ Docker volumes directory not found - using local permissions"
fi

# Start containers
echo "🚀 Restarting containers..."
docker compose up -d

# Wait for startup
sleep 8

# Check status
echo "✅ Checking container logs..."
docker compose logs web --tail=10

echo ""
echo "🎯 Permission fix complete!"
echo "💾 Data directory: ./data (writable for container)"
echo "🔍 Check logs: docker compose logs -f web"