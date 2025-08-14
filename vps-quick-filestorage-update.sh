#!/bin/bash

echo "⚡ Quick FileStorage Update für Walter Braun VPS"
echo "=============================================="

# Stop containers
echo "🔄 Stopping containers..."
docker-compose down

# Backup existing data
if [ -f "./data/blog_posts.json" ]; then
    echo "💾 Backing up existing blog data..."
    cp ./data/blog_posts.json ./data/backup_$(date +%H%M%S).json
fi

# Ensure data directory exists
mkdir -p ./data
chmod 755 ./data

# Rebuild and restart
echo "🔨 Rebuilding web container..."
docker-compose build --no-cache web

echo "🚀 Starting containers..."
docker-compose up -d

# Wait and check
sleep 8
echo "✅ Checking status..."
docker-compose ps

# Quick health check
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Website responding"
    echo "📊 FileStorage: $(ls -la ./data/ 2>/dev/null || echo 'Directory created')"
    echo "🎯 Update complete - Blog system now uses persistent FileStorage!"
else
    echo "❌ Issue detected - checking logs:"
    docker-compose logs web --tail=20
fi