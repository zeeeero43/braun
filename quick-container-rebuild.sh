#!/bin/bash

echo "⚡ Quick Container Rebuild (ohne Git Update)"
echo "============================================"

echo "1. Container stoppen:"
docker compose down

echo ""
echo "2. Container Images löschen für kompletten Rebuild:"
docker compose rm -f
docker image prune -f

echo ""
echo "3. Container komplett neu bauen:"
docker compose build --no-cache --pull

echo ""
echo "4. Container starten:"
docker compose up -d

echo ""
echo "5. Warten auf Start (45s):"
sleep 45

echo ""
echo "6. Container Status:"
docker compose ps

echo ""
echo "7. Quick API Test:"
curl -X POST http://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Quick Test","email":"test@test.com","phone":"123","message":"Quick Rebuild Test"}' \
  -w "\nHTTP Status: %{http_code}\n" 2>/dev/null

echo ""
echo "8. Container Logs (API Routes):"
docker compose logs web --tail=20 | grep -E "(POST|routes|Registered)" || echo "Keine Route-Logs"

echo "============================================"
echo "✅ Quick Rebuild abgeschlossen!"
echo "Container wurden mit aktuellem Code neu gebaut."
echo "============================================"