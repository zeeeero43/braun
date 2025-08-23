#!/bin/bash

echo "🔧 Production API Test"
echo "===================="

echo "1. Container Status:"
docker compose ps

echo ""
echo "2. Test /api/contact direkt:"
curl -X POST http://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test API","email":"test@test.com","phone":"123","message":"API Test"}' \
  -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n"

echo ""
echo "3. Test /api/blog:"
curl http://walterbraun-muenchen.de/api/blog -w "\nHTTP Status: %{http_code}\n" 2>/dev/null | head -3

echo ""
echo "4. Container Logs - Suche nach API Route Registration:"
docker compose logs web --tail=30 | grep -E "(Registered|routes|POST|contact)" || echo "Keine Route-Logs gefunden"

echo ""
echo "5. Container Logs - Letzte Fehler:"
docker compose logs web --tail=20 | grep -E "(404|Error|error|Cannot)" || echo "Keine API-Fehler"

echo "===================="