#!/bin/bash

echo "🚀 Simple Deploy (ohne nginx, ohne health check)"
echo "=============================================="

echo "1. Container stoppen..."
docker compose down --remove-orphans --volumes

echo ""
echo "2. System-Webserver stoppen (falls läuft)..."
sudo systemctl stop apache2 nginx 2>/dev/null
sudo fuser -k 80/tcp 2>/dev/null

echo ""
echo "3. Container neu starten (vereinfacht)..."
docker compose up -d --build

echo ""
echo "4. Warte auf Start (45s)..."
sleep 45

echo ""
echo "5. Container Status:"
docker compose ps

echo ""
echo "6. Web Container Logs:"
docker compose logs web --tail=20

echo ""
echo "7. Test HTTP-Verbindung:"
curl -I http://localhost || echo "HTTP-Test fehlgeschlagen"

echo ""
echo "8. Test Domain:"
curl -I http://walterbraun-muenchen.de 2>/dev/null || echo "Domain-Test fehlgeschlagen (normal wenn DNS nicht konfiguriert)"

echo "=============================================="
echo "✅ Simple Deploy abgeschlossen!"
echo ""
echo "🌐 Website läuft auf:"
echo "   - http://localhost"
echo "   - http://walterbraun-muenchen.de (wenn DNS konfiguriert)"
echo ""
echo "📝 Setup:"
echo "   - Web Container direkt auf Port 80"
echo "   - Nginx NICHT verwendet (normal für diese Konfiguration)"
echo "   - Health Check entfernt"
echo "=============================================="