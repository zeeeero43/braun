#!/bin/bash

# Walter Braun Umzüge - VPS Docker Fix
# Für Ihre VPS mit Docker Installation

set -e

echo "🚀 VPS Docker Fix für Walter Braun Umzüge"
echo "========================================"

# Prüfung ob wir auf VPS sind
if ! command -v docker &> /dev/null; then
    echo "❌ Docker nicht gefunden. Führen Sie dieses Script auf Ihrem VPS aus."
    echo "📋 Auf VPS ausführen: scp vps-docker-fix.sh root@217.154.205.93:/opt/walter-braun-umzuege/"
    exit 1
fi

# 1. Stoppe Container
echo "🛑 Stoppe bestehende Container..."
docker compose down || echo "Container waren bereits gestoppt"

# 2. Entferne alte Images
echo "🗑️ Entferne alte Images..."
docker rmi walter-braun-umzuege-web 2>/dev/null || echo "Image bereits entfernt"
docker image prune -f

# 3. Build komplett neu
echo "🔨 Baue Container neu (ohne Vite-Import)..."
docker compose build --no-cache --pull web

# 4. Starte alle Services
echo "🚀 Starte alle Container..."
docker compose up -d

# 5. Warte auf Start
echo "⏳ Warte auf Container-Start..."
sleep 15

# 6. Status prüfen
echo "📊 Container Status:"
docker compose ps

# 7. Logs anzeigen
echo ""
echo "📋 Web Container Logs:"
docker compose logs web --tail=15

# 8. Health Checks
echo ""
echo "🧪 Health Checks..."
sleep 5

# Web Health Check
for i in {1..10}; do
    if curl -f -s --max-time 10 http://localhost/health >/dev/null 2>&1; then
        echo "✅ Web Container: OK"
        break
    fi
    echo "⏳ Warte auf Web... ($i/10)"
    sleep 3
done

# Final Check
if curl -f -s --max-time 10 http://localhost >/dev/null 2>&1; then
    echo ""
    echo "🎉 SUCCESS! Walter Braun Umzüge läuft!"
    echo "🌐 Website: http://217.154.205.93"
    echo "🏥 Health: http://217.154.205.93/health"
    echo ""
    echo "📋 Weitere Befehle:"
    echo "   docker compose logs web -f     # Live Logs"
    echo "   docker compose ps              # Status"
    echo "   docker compose restart web     # Restart"
else
    echo ""
    echo "⚠️ Container startet noch oder Problem erkannt"
    echo "📋 Logs prüfen: docker compose logs web"
    echo "📋 Status prüfen: docker compose ps"
fi