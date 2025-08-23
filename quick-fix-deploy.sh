#!/bin/bash

echo "⚡ Quick Fix - Health Check reparieren"
echo "===================================="

echo "1. Stoppe Container..."
docker compose down

echo ""
echo "2. Starte Container mit repariertem Health Check..."
docker compose up -d

echo ""  
echo "3. Warte auf Health Check (60s)..."
sleep 60

echo ""
echo "4. Finaler Status:"
docker compose ps

echo ""
echo "5. Test HTTP-Verbindung:"
curl -I http://localhost || echo "HTTP-Test fehlgeschlagen"

echo ""
echo "6. Test HTTPS (falls verfügbar):"
curl -I https://localhost 2>/dev/null || echo "HTTPS nicht verfügbar (normal für HTTP-only Setup)"

echo ""
echo "7. Test mit Domain:"
curl -I http://walterbraun-muenchen.de || echo "Domain-Test fehlgeschlagen"

echo "===================================="
echo "✅ Quick Fix abgeschlossen!"
echo "🌐 Website: http://walterbraun-muenchen.de"
echo "===================================="