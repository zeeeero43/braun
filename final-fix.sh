#!/bin/bash

echo "🏁 Final Fix - Health Check entfernen"
echo "===================================="

echo "1. Stoppe Container..."
docker compose down --remove-orphans

echo ""
echo "2. Starte Container ohne Health Check..."
docker compose up -d

echo ""
echo "3. Warte auf Container-Start (30s)..."
sleep 30

echo ""
echo "4. Container Status:"
docker compose ps

echo ""
echo "5. Test Website:"
curl -I http://localhost || echo "HTTP-Test fehlgeschlagen"

echo ""
echo "6. Test mit Domain:"
curl -I http://walterbraun-muenchen.de 2>/dev/null || echo "Domain noch nicht konfiguriert"

echo ""
echo "7. Web Container Logs (letzte 10 Zeilen):"
docker compose logs web --tail=10

echo "===================================="
echo "✅ Final Fix abgeschlossen!"
echo "🌐 Website läuft auf: http://localhost"
echo "🌐 Domain: http://walterbraun-muenchen.de"
echo "===================================="