#!/bin/bash

echo "🧪 Testing VPS Blog System..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Build und teste das Dockerfile lokal
echo "🔨 Building production Docker image locally..."
docker build -f Dockerfile.production -t walter-braun-test .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    echo "🚀 Starting test container..."
    docker run -d \
        --name walter-braun-test \
        -p 3001:5000 \
        -e DATABASE_URL="postgresql://test:test@host.docker.internal:5432/test" \
        -e DEEPSEEK_API_KEY="test" \
        -e RUNWARE_API_KEY="test" \
        walter-braun-test
    
    echo "⏱️ Waiting 10 seconds for startup..."
    sleep 10
    
    echo "🏥 Testing health endpoint..."
    curl -f http://localhost:3001/health && echo "✅ Health check passed!" || echo "❌ Health check failed!"
    
    echo "📋 Container logs:"
    docker logs walter-braun-test --tail 20
    
    echo "🧹 Cleaning up..."
    docker stop walter-braun-test
    docker rm walter-braun-test
    docker rmi walter-braun-test
    
else
    echo "❌ Docker build failed!"
    exit 1
fi

echo "🏁 Test completed!"