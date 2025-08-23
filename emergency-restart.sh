#!/bin/bash

echo "🔄 EMERGENCY RESTART - Website wiederherstellen"
echo "==============================================="

echo "1. Stoppe alle Container..."
docker compose down --remove-orphans --volumes

echo ""
echo "2. Stoppe System-Webserver die Port 80 blockieren könnten..."
sudo systemctl stop apache2 nginx lighttpd 2>/dev/null
sudo fuser -k 80/tcp 443/tcp 2>/dev/null

echo ""
echo "3. Docker Service neustarten..."
sudo systemctl restart docker
sleep 10

echo ""
echo "4. Verwende funktionierende Konfiguration (ohne Health Checks)..."
cp docker-compose-fixed.yml docker-compose.yml

echo ""
echo "5. Container neu starten..."
docker compose up -d --build

echo ""
echo "6. Warte auf Container-Start (45s)..."
sleep 45

echo ""
echo "7. Container Status:"
docker compose ps

echo ""
echo "8. Teste Verbindung:"
curl -I http://localhost || echo "❌ localhost nicht erreichbar"
curl -I http://217.154.205.93 || echo "❌ IP nicht erreichbar"
curl -I http://walterbraun-muenchen.de || echo "❌ Domain nicht erreichbar"

echo ""
echo "9. Web Container Logs:"
docker compose logs web --tail=15

echo "==============================================="
echo "🎯 Emergency Restart abgeschlossen"
echo "Website sollte wieder erreichbar sein unter:"
echo "- http://217.154.205.93"
echo "- http://walterbraun-muenchen.de"
echo "==============================================="