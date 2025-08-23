#!/bin/bash

echo "🚀 Walter Braun VPS Quick Port Fix"

# Stoppe bestehende Container
docker compose down --remove-orphans 2>/dev/null

# Stoppe alle Webserver die Port 80 belegen könnten
sudo systemctl stop apache2 2>/dev/null
sudo systemctl stop nginx 2>/dev/null  
sudo systemctl stop lighttpd 2>/dev/null

# Kill alle Prozesse auf Port 80
sudo fuser -k 80/tcp 2>/dev/null

# Prüfe ob Port 80 frei ist
if netstat -tlnp | grep -q :80; then
    echo "⚠️  Port 80 immer noch belegt - verwende Port 8080"
    export WALTER_BRAUN_HTTP_PORT=8080
    echo "Website wird auf Port 8080 verfügbar sein"
else
    echo "✅ Port 80 ist frei"
    export WALTER_BRAUN_HTTP_PORT=80
fi

# Starte Container
echo "Starte Walter Braun Container..."
docker compose up -d --build

# Warten und Status prüfen  
sleep 15
echo "Container Status:"
docker compose ps

echo "Logs:"
docker compose logs --tail=10 web

echo "✅ Fix abgeschlossen!"

if [ "$WALTER_BRAUN_HTTP_PORT" = "8080" ]; then
    echo "🌐 Website: http://walterbraun-muenchen.de:8080"
else
    echo "🌐 Website: http://walterbraun-muenchen.de"
fi