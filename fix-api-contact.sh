#!/bin/bash

echo "🔧 Contact Form API Fix"
echo "======================="

echo "1. Prüfe aktuelle /api/contact Route..."
curl -X POST http://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"123","message":"Test"}' \
  2>/dev/null | head -5

echo ""
echo "2. Container Logs für API-Fehler:"
docker compose logs web --tail=20 | grep -E "(contact|POST|404|500|Error)" || echo "Keine API-Fehler gefunden"

echo ""
echo "3. Registrierte Routes prüfen:"
docker compose logs web --tail=50 | grep -E "(POST|GET|route)" | tail -10

echo ""
echo "4. Quick Fix - Container neu starten:"
docker compose restart web

echo ""
echo "5. Warte auf Neustart (30s)..."
sleep 30

echo ""
echo "6. Test Contact API wieder:"
curl -X POST http://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"123","message":"Test"}' \
  -w "\nHTTP Status: %{http_code}\n" 2>/dev/null

echo "======================="