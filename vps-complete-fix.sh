#!/bin/bash

echo "🔧 Walter Braun - VPS Complete FileStorage Fix"
echo "=============================================="

# Stop containers
echo "🔄 Stopping all containers..."
docker compose down --volumes

# Clean up existing containers and images
echo "🧹 Cleaning up Docker resources..."
docker container prune -f
docker image prune -f

# Create and fix permissions for data directory
echo "📁 Setting up data directories with proper permissions..."
sudo rm -rf ./data ./uploads ./logs
mkdir -p ./data ./uploads ./logs
sudo chmod 755 ./data ./uploads ./logs
sudo chown -R 1000:1000 ./data ./uploads ./logs

echo "💾 Data directory structure:"
ls -la ./data ./uploads ./logs 2>/dev/null || echo "Directories created"

# Rebuild everything
echo "🔨 Rebuilding all containers from scratch..."
docker compose build --no-cache

# Start containers
echo "🚀 Starting containers with volume mounts..."
docker compose up -d

# Wait for startup
echo "⏳ Waiting for containers to initialize..."
sleep 15

# Check container status
echo "📊 Container Status:"
docker compose ps

# Test data directory access
echo ""
echo "🔍 Testing data directory access..."
docker compose exec -T web ls -la /app/ | grep data || echo "Data directory check failed"

# Check logs
echo ""
echo "📋 Recent container logs:"
docker compose logs web --tail=15

# Final test
echo ""
echo "🎯 Testing website response..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Website is responding correctly!"
    echo "🔗 Access: http://$(hostname -I | awk '{print $1}')"
else
    echo "❌ Website not responding - check logs:"
    docker compose logs web --tail=20
fi

echo ""
echo "🎯 FileStorage Fix Complete!"
echo "📁 Data persistence: ./data (mounted in container)"
echo "🔍 Monitor: docker compose logs -f web"