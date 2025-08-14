#!/bin/bash

echo "🔄 Walter Braun Umzüge - FileStorage VPS Update"
echo "==============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found. Please run this from the project directory."
    exit 1
fi

# Create backup of current data
print_warning "Creating backup of current blog posts..."
if [ -f "./data/blog_posts.json" ]; then
    cp ./data/blog_posts.json ./data/blog_posts_backup_$(date +%Y%m%d_%H%M%S).json
    print_status "Backup created"
fi

# Stop containers
print_warning "Stopping containers..."
docker-compose down

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    print_warning "Pulling latest code changes..."
    git pull
fi

# Rebuild containers
print_warning "Rebuilding Docker containers..."
docker-compose build --no-cache web

# Create data directory with proper permissions
print_warning "Setting up data directory..."
mkdir -p ./data
chmod 755 ./data

# Start containers
print_warning "Starting updated containers..."
docker-compose up -d

# Wait for containers to be ready
print_warning "Waiting for containers to start..."
sleep 10

# Check container status
print_warning "Checking container status..."
docker-compose ps

# Check if web container is healthy
if docker-compose ps | grep -q "web.*Up"; then
    print_status "Web container is running"
else
    print_error "Web container failed to start"
    docker-compose logs web
    exit 1
fi

# Check if database container is healthy (if using PostgreSQL)
if docker-compose ps | grep -q "db.*Up"; then
    print_status "Database container is running"
else
    print_warning "Database container not found - using FileStorage mode"
fi

# Test blog system
print_warning "Testing blog system..."
sleep 5

# Check logs for FileStorage confirmation
if docker-compose logs web | tail -20 | grep -q "FileStorage\|PostgreSQL"; then
    print_status "Storage system initialized successfully"
else
    print_warning "Storage system status unclear - check logs"
fi

# Display current blog posts count
print_warning "Checking blog data..."
if [ -f "./data/blog_posts.json" ]; then
    post_count=$(jq length ./data/blog_posts.json 2>/dev/null || echo "unknown")
    print_status "Blog posts in FileStorage: $post_count"
else
    print_status "Blog posts stored in PostgreSQL or new FileStorage"
fi

# Final status check
print_warning "Final system check..."
if curl -s http://localhost:5000/health > /dev/null; then
    print_status "Website is responding correctly"
else
    print_error "Website not responding - check logs"
    docker-compose logs web --tail=50
fi

echo ""
print_status "VPS Update Complete!"
echo "🔗 Website: http://$(hostname -I | awk '{print $1}')"
echo "📊 Blog System: FileStorage (persistent across restarts)"
echo "🔧 Check logs: docker-compose logs -f web"
echo ""
print_warning "Important: Blog posts are now stored in ./data/ directory"
print_warning "This directory persists across container restarts!"