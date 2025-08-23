#!/bin/bash

echo "🚀 Walter Braun VPS Ultimate Fix - Docker Compose Version"
echo "=============================================="

# Stoppe alle Container 
echo "1. Stoppe alle Walter Braun Container..."
docker compose down --remove-orphans --volumes 2>/dev/null

# Entferne alle nicht verwendeten Container und Images
echo "2. Bereinige Docker..."
docker system prune -f

# Stoppe andere Webserver
echo "3. Stoppe konkurrierende Webserver..."
sudo systemctl stop apache2 2>/dev/null || echo "Apache nicht installiert"
sudo systemctl stop nginx 2>/dev/null || echo "Nginx nicht installiert"
sudo systemctl stop lighttpd 2>/dev/null || echo "Lighttpd nicht installiert"

# Kill Prozesse auf Port 80 und 443
echo "4. Befreie Ports 80 und 443..."
sudo fuser -k 80/tcp 2>/dev/null || echo "Port 80 bereits frei"
sudo fuser -k 443/tcp 2>/dev/null || echo "Port 443 bereits frei"

# Warte kurz
sleep 3

# Prüfe Ports
echo "5. Prüfe Port-Status..."
if netstat -tlnp | grep -E ':80\s|:443\s'; then
    echo "⚠️ Ports 80/443 noch belegt - verwende alternative Ports"
    export WALTER_BRAUN_HTTP_PORT=8080
    export WALTER_BRAUN_HTTPS_PORT=8443
else
    echo "✅ Ports 80/443 sind frei"
    export WALTER_BRAUN_HTTP_PORT=80
    export WALTER_BRAUN_HTTPS_PORT=443
fi

# Umgebungsvariablen prüfen
echo "6. Setze Umgebungsvariablen..."
export POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-secure_password_2024}
echo "POSTGRES_PASSWORD: ***gesetzt***"

if [ -z "$DEEPSEEK_API_KEY" ]; then
    echo "⚠️ DEEPSEEK_API_KEY nicht gesetzt"
fi

if [ -z "$RUNWARE_API_KEY" ]; then
    echo "⚠️ RUNWARE_API_KEY nicht gesetzt"
fi

# Build und Start
echo "7. Baue und starte Container..."
docker compose build --no-cache
docker compose up -d

# Warten auf Start
echo "8. Warte auf Container-Start..."
sleep 30

# Status prüfen
echo "9. Prüfe Container-Status..."
docker compose ps

echo "10. Prüfe Logs..."
docker compose logs --tail=20

echo "11. Teste Verbindung..."
if [ "$WALTER_BRAUN_HTTP_PORT" = "80" ]; then
    TEST_URL="http://localhost"
else
    TEST_URL="http://localhost:$WALTER_BRAUN_HTTP_PORT"
fi

if curl -s -o /dev/null -w "%{http_code}" "$TEST_URL" | grep -q "200"; then
    echo "✅ Website ist erreichbar: $TEST_URL"
else
    echo "❌ Website nicht erreichbar - prüfe Logs:"
    docker compose logs web --tail=10
fi

echo "=============================================="
echo "Fix abgeschlossen!"
echo "Website URL: http://walterbraun-muenchen.de:$WALTER_BRAUN_HTTP_PORT"
echo "=============================================="