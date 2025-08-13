#!/bin/bash

# Walter Braun Umzüge - VPS Deployment Script
# Behebt Vite Import Fehler und deployed die App korrekt

set -e

echo "🚀 Walter Braun Umzüge - VPS Deployment"
echo "========================================"
echo ""

# 1. Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json nicht gefunden. Sind Sie im richtigen Verzeichnis?"
    exit 1
fi

echo "✅ Projekt gefunden"

# 2. Install dependencies
echo "📦 Installiere Dependencies..."
npm ci --production=false

# 3. Build the application (client and server)
echo "🏗️ Baue Anwendung (Frontend + Backend)..."
npm run build

# 5. Copy static files to the correct location
echo "📁 Kopiere statische Dateien..."
mkdir -p public
if [ -d "dist/public" ]; then
    cp -r dist/public/* public/ || echo "Keine Dateien zum Kopieren gefunden"
fi

# 6. Set production environment
echo "🔧 Setze Produktionsumgebung..."
export NODE_ENV=production

# 7. Check if port is available
PORT=${PORT:-5000}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️ Port $PORT ist bereits belegt. Stoppe bestehenden Prozess..."
    pkill -f "node.*dist/index.js" || true
    sleep 2
fi

# 8. Start the application
echo "🚀 Starte Anwendung auf Port $PORT..."
NODE_ENV=production PORT=$PORT node dist/index.js &

# 9. Wait for startup and test
echo "⏳ Warte auf Startup..."
sleep 5

# 10. Health check
for i in {1..10}; do
    if curl -f -s --max-time 5 http://localhost:$PORT/health >/dev/null 2>&1; then
        echo "✅ Health Check: OK"
        break
    fi
    echo "⏳ Health Check... ($i/10)"
    sleep 2
done

# 11. Final status
if curl -f -s --max-time 5 http://localhost:$PORT/health >/dev/null 2>&1; then
    echo ""
    echo "🎉 DEPLOYMENT ERFOLGREICH!"
    echo "🌐 Anwendung läuft auf: http://localhost:$PORT"
    echo "🏥 Health Check: http://localhost:$PORT/health"
else
    echo ""
    echo "❌ DEPLOYMENT FEHLGESCHLAGEN"
    echo "📋 Logs anzeigen: journalctl -f"
    exit 1
fi

echo ""
echo "📝 Weitere Befehle:"
echo "   - Logs anzeigen: journalctl -f"
echo "   - Prozess stoppen: pkill -f 'node.*dist/index.js'"
echo "   - Neu starten: ./deploy-vps.sh"