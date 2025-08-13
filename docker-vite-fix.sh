#!/bin/bash

# Walter Braun Umzüge - Docker Vite Import Fix
# Behebt Vite Import Fehler in Docker Container

set -e

echo "🐳 Docker Vite Import Fix - FINALE LÖSUNG"
echo "========================================"

# 1. Stoppe Container
echo "🛑 Stoppe bestehende Container..."
docker compose down

# 2. Entferne alte Images (clean slate)
echo "🗑️ Entferne alte Images..."
docker rmi walter-braun-umzuege-web 2>/dev/null || echo "Image bereits entfernt"

# 3. Baue Container neu (ohne Cache für clean build)
echo "🔨 Baue Container neu mit Vite-freiem Server..."
docker compose build --no-cache web

# 4. Starte Container
echo "🚀 Starte Container..."
docker compose up -d

# 4. Warte auf Container Start
echo "⏳ Warte auf Container..."
sleep 10

# 5. Prüfe Container Status
echo "📊 Container Status:"
docker compose ps

# 6. Prüfe Logs
echo ""
echo "📋 Container Logs:"
docker compose logs web --tail=20

# 7. Health Check
echo ""
echo "🧪 Health Check..."
for i in {1..10}; do
    if curl -f -s --max-time 5 http://localhost/health >/dev/null 2>&1; then
        echo "✅ Health Check: OK"
        break
    fi
    echo "⏳ Health Check... ($i/10)"
    sleep 3
done

# 8. Final Status
if curl -f -s --max-time 5 http://localhost >/dev/null 2>&1; then
    echo ""
    echo "🎉 SUCCESS! Container läuft erfolgreich"
    echo "🌐 Website: http://$(hostname -I | awk '{print $1}')"
    echo "🏥 Health: http://$(hostname -I | awk '{print $1}')/health"
    echo "📋 Logs: docker compose logs web -f"
else
    echo ""
    echo "❌ Container antwortet nicht"
    echo "📋 Debug: docker compose logs web"
    exit 1
fi