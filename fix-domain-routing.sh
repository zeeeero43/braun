#!/bin/bash

echo "🔧 Fix Domain Routing - walterbraun-muenchen.de"
echo "=============================================="

echo "1. Container Status:"
docker compose ps

echo ""
echo "2. Test direkte IP (sollte funktionieren):"
curl -I http://217.154.205.93/ || echo "IP Test fehlgeschlagen"

echo ""
echo "3. Test Domain mit Host-Header:"
curl -I -H "Host: walterbraun-muenchen.de" http://217.154.205.93/ || echo "Host-Header Test fehlgeschlagen"

echo ""
echo "4. Test Domain direkt:"
curl -I http://walterbraun-muenchen.de/ || echo "Domain Test fehlgeschlagen"

echo ""
echo "5. DNS-Auflösung prüfen:"
nslookup walterbraun-muenchen.de

echo ""
echo "6. Container Logs (letzte 15 Zeilen):"
docker compose logs web --tail=15

echo ""
echo "7. Test mit verschiedenen User-Agents:"
echo "Standard curl:"
curl -s -o /dev/null -w "%{http_code}" http://walterbraun-muenchen.de/
echo "Browser User-Agent:"
curl -s -o /dev/null -w "%{http_code}" -H "User-Agent: Mozilla/5.0" http://walterbraun-muenchen.de/

echo "=============================================="
echo "Diagnose abgeschlossen"
echo "=============================================="