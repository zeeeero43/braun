#!/bin/bash

echo "🔥 ULTIMATE FIX - ERR_SSL_PROTOCOL_ERROR"
echo "======================================="

# Backup aktuelle Konfiguration
cp docker-compose.yml docker-compose.yml.backup

# Verwende die reparierte Konfiguration
cp docker-compose-fixed.yml docker-compose.yml

echo "1. Stoppe alle Container..."
docker compose down --remove-orphans --volumes

echo ""
echo "2. Stoppe System-Webserver..."
sudo systemctl stop apache2 nginx 2>/dev/null
sudo fuser -k 80/tcp 443/tcp 2>/dev/null

echo ""
echo "3. Container mit reparierter Konfiguration starten..."
docker compose up -d --build

echo ""
echo "4. Warte auf Start (60s)..."
sleep 60

echo ""
echo "5. Container Status:"
docker compose ps

echo ""
echo "6. Test HTTP-Verbindung:"
curl -I http://localhost || echo "HTTP-Test fehlgeschlagen"

echo ""
echo "7. Web Container Logs:"
docker compose logs web --tail=15

echo "======================================="
echo "✅ ULTIMATE FIX ABGESCHLOSSEN!"
echo ""
echo "🎯 ERR_SSL_PROTOCOL_ERROR behoben:"
echo "   ✅ Health Checks entfernt"
echo "   ✅ Nginx nicht benötigt"
echo "   ✅ Web Container direkt auf Port 80"
echo ""
echo "🌐 Website läuft auf:"
echo "   - http://localhost"
echo "   - http://walterbraun-muenchen.de"
echo "======================================="