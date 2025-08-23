#!/bin/bash

echo "⚡ Quick Dockerfile Fix & Container Rebuild"
echo "==========================================="

echo "1. Stop containers:"
docker compose down --remove-orphans

echo ""
echo "2. Remove old images:"
docker image rm walter-braun-umzuege-web 2>/dev/null || echo "Image already removed"
docker system prune -f

echo ""
echo "3. Build with working Dockerfile:"
docker compose build --no-cache web

echo ""
echo "4. Start container:"
docker compose up -d

echo ""
echo "5. Monitor startup (60s):"
for i in {1..12}; do
    echo "Check $i/12..."
    HEALTH=$(docker inspect walter_braun_web --format='{{.State.Health.Status}}' 2>/dev/null)
    STATUS=$(docker inspect walter_braun_web --format='{{.State.Status}}' 2>/dev/null)
    echo "Status: $STATUS, Health: $HEALTH"
    
    if [ "$STATUS" = "running" ] && [ "$HEALTH" = "healthy" ]; then
        echo "✅ Container running and healthy!"
        break
    fi
    sleep 5
done

echo ""
echo "6. Container Logs:"
docker compose logs web --tail=20

echo ""
echo "7. Final API Test:"
sleep 10
curl -X POST http://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Final Test","email":"test@test.com","phone":"123","message":"Final container test"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  --connect-timeout 10 \
  2>/dev/null && echo "✅ API working!" || echo "⚠️ API test failed"

echo "==========================================="