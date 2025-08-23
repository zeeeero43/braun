#!/bin/bash

echo "🎯 FINAL FIX - Einfacher funktionierender Server"
echo "=============================================="

echo "1. Container stoppen"
docker compose down --remove-orphans

echo ""
echo "2. Aufräumen"
docker system prune -f
docker image rm walter-braun-umzuege-web 2>/dev/null || echo "OK"

echo ""
echo "3. Einfacher Container Build"
docker compose build --no-cache web

echo ""
echo "4. Container starten"
docker compose up -d

echo ""
echo "5. 45s warten für kompletten Start"
sleep 45

echo ""
echo "6. Status prüfen"
docker compose ps

echo ""
echo "7. Container Logs"
docker compose logs web --tail=15

echo ""
echo "8. Direct API Test"
curl -X POST http://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Final Test","email":"test@test.com","phone":"123456","message":"Final test message"}' \
  -w "\nStatus: %{http_code}\n" 2>/dev/null

echo ""
echo "9. HTTPS Test"
curl -X POST https://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"HTTPS Test","email":"test@test.com","phone":"123456","message":"HTTPS test"}' \
  -w "\nStatus: %{http_code}\n" --insecure 2>/dev/null

echo "=============================================="
echo "RESULT:"
FINAL_STATUS=$(docker compose ps --format 'table {{.Name}}\t{{.Status}}' | grep walter_braun_web | awk '{print $2,$3,$4}')
echo "Container: $FINAL_STATUS"
echo ""
echo "Website: https://walterbraun-muenchen.de"
echo "Contact Form API: https://walterbraun-muenchen.de/api/contact"
echo "=============================================="