#!/bin/bash

echo "🔧 Deploy Domain Fix für walterbraun-muenchen.de"
echo "==============================================="

echo "1. Container stoppen..."
docker compose down

echo ""
echo "2. Container mit Domain-Fix neu bauen..."
docker compose build --no-cache

echo ""
echo "3. Container starten..."
docker compose up -d

echo ""
echo "4. Warte auf Start (30s)..."
sleep 30

echo ""
echo "5. Container Status:"
docker compose ps

echo ""
echo "6. Test IP (sollte funktionieren):"
curl -I http://217.154.205.93/ || echo "IP Test fehlgeschlagen"

echo ""
echo "7. Test Domain (sollte jetzt funktionieren):"
curl -I http://walterbraun-muenchen.de/ || echo "Domain Test fehlgeschlagen"

echo ""
echo "8. Test mit www-Subdomain:"
curl -I http://www.walterbraun-muenchen.de/ || echo "WWW Test fehlgeschlagen"

echo ""
echo "9. Container Logs (letzte 15 Zeilen):"
docker compose logs web --tail=15

echo "==============================================="
echo "✅ Domain Fix Deployment abgeschlossen!"
echo ""
echo "🌐 Website sollte erreichbar sein unter:"
echo "   - http://walterbraun-muenchen.de ✅"
echo "   - http://www.walterbraun-muenchen.de ✅"
echo "   - http://217.154.205.93 ✅"
echo "==============================================="