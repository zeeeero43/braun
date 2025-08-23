#!/bin/bash

echo "🔧 Fix Contact Form API - /api/contact 404 Error"
echo "================================================"

echo "1. Container Status:"
docker compose ps

echo ""
echo "2. Test /api/contact Route:"
curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Test message"}' \
     http://localhost/api/contact || echo "API Test fehlgeschlagen"

echo ""
echo "3. Test direkte IP:"
curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Test message"}' \
     http://217.154.205.93/api/contact || echo "IP API Test fehlgeschlagen"

echo ""
echo "4. Web Container Logs (letzte 20 Zeilen):"
docker compose logs web --tail=20

echo ""
echo "5. Liste alle verfügbaren Routes:"
curl -s http://localhost/api/health || echo "Health endpoint nicht verfügbar"

echo ""
echo "6. Container neu starten mit API-Fix..."
docker compose restart web

echo ""
echo "7. Warte auf Neustart (30s)..."
sleep 30

echo ""
echo "8. Test nach Neustart:"
curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"Test Fix","email":"test@example.com","message":"Test after restart"}' \
     http://localhost/api/contact || echo "API Test nach Restart fehlgeschlagen"

echo "================================================"
echo "Contact Form API Diagnose abgeschlossen"
echo "================================================"