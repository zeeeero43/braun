#!/bin/bash

# Vite Production Fix Script - Walter Braun Umzüge
# Löst das "Cannot find package 'vite'" Problem komplett

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🔧 Vite Production Problem wird behoben..."

cd "$PROJECT_DIR"

# 1. Container stoppen
echo "🛑 Stoppe Container..."
docker compose down

# 2. Dockerfile für Development-Modus anpassen (mit tsx support)
echo "📝 Ändere Dockerfile für Development-Modus..."
sed -i 's/CMD \["npm", "start"\]/CMD ["npm", "run", "dev"]/' Dockerfile
# Stelle sicher dass alle Dependencies (including dev) installiert werden
sed -i 's/npm ci --omit=dev/npm ci/' Dockerfile

# 3. Docker Compose für Development anpassen
echo "📝 Ändere docker-compose.yml für Development..."
sed -i 's/NODE_ENV: production/NODE_ENV: development/' docker-compose.yml

# 4. Port Mapping korrigieren (falls nötig)
if ! grep -q "80:5000" docker-compose.yml; then
    echo "🔧 Korrigiere Port Mapping..."
    sed -i '/- "5000:5000"/c\      - "80:5000"' docker-compose.yml
fi

# 5. Build ohne Cache
echo "🔨 Baue Container neu ohne Cache..."
docker compose build --no-cache

# 6. Container starten
echo "🚀 Starte Container..."
docker compose up -d

# 7. Warten und Status prüfen
echo "⏳ Warte 60 Sekunden auf vollständigen Start..."
for i in {1..60}; do
    echo -n "."
    sleep 1
done
echo ""

echo "📊 Container Status:"
docker compose ps

echo "📋 Container Logs (letzte 20 Zeilen):"
docker compose logs web --tail=20

# 8. Tests durchführen
echo "🧪 Teste Anwendung..."

# Test 1: Health Check
if curl -f -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Health Check erfolgreich (Port 5000)"
else
    echo "⚠️  Health Check fehlgeschlagen (Port 5000)"
fi

# Test 2: Hauptseite über Port 80
if curl -f -s http://localhost > /dev/null 2>&1; then
    echo "✅ Hauptseite erreichbar (Port 80)"
else
    echo "⚠️  Hauptseite nicht erreichbar (Port 80)"
fi

# Test 3: Direkt über Port 5000
if curl -f -s http://localhost:5000 > /dev/null 2>&1; then
    echo "✅ Anwendung läuft auf Port 5000"
else
    echo "⚠️  Port 5000 nicht erreichbar"
fi

echo ""
echo "🎉 Fix abgeschlossen!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Ihre Website sollte jetzt erreichbar sein unter:"
echo "   🌐 http://$(hostname -I | awk '{print $1}') (Hauptseite)"
echo "   🏥 http://$(hostname -I | awk '{print $1}')/health (Health Check)"
echo "   🔧 http://$(hostname -I | awk '{print $1}'):5000 (Direkt)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if docker compose ps | grep -q "Up"; then
    echo "✅ Alle Container laufen"
    if curl -f -s http://localhost > /dev/null 2>&1; then
        echo "✅ Website ist verfügbar"
        echo "🎯 ERFOLG: Walter Braun Umzüge Website läuft!"
    else
        echo "⚠️  Website reagiert noch nicht - prüfen Sie die Logs:"
        echo "   docker compose logs web"
    fi
else
    echo "❌ Container laufen nicht - prüfen Sie die Logs:"
    echo "   docker compose logs"
fi

echo ""
echo "🔑 Vergessen Sie nicht: API-Schlüssel in .env konfigurieren!"
echo "   nano .env"
echo "   docker compose restart"