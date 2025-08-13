#!/bin/bash

# Direct Web Start für Walter Braun Umzüge
# Startet Web Container direkt

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"
cd "$PROJECT_DIR"

echo "🚀 Starte Web Container direkt..."

# 1. Aktueller Status
docker compose ps

# 2. Web Container direkt starten falls gestoppt
echo "🔄 Starte Web Service..."
docker compose up -d web 2>/dev/null || {
    echo "❌ Web Container Build erforderlich"
    echo "🔨 Baue Web Container..."
    docker compose build web
    echo "🚀 Starte Web Container..."
    docker compose up -d web
}

# 3. Warte auf Start
echo "⏳ Warte auf Web Container..."
for i in {1..60}; do
    if docker compose ps web | grep -q "Up"; then
        echo "✅ Web Container gestartet!"
        break
    fi
    sleep 2
done

# 4. Warte auf Service
echo "⏳ Warte auf Health Check..."
for i in {1..30}; do
    if curl -f -s http://localhost:5000/health >/dev/null 2>&1; then
        echo "✅ Service bereit!"
        break
    fi
    sleep 3
done

# 5. Status
docker compose ps
echo ""
curl -s http://localhost:5000/health && echo "✅ Health OK" || echo "❌ Health FAIL"
curl -s http://localhost >/dev/null && echo "✅ Website OK" || echo "❌ Website FAIL"