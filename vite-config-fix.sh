#!/bin/bash

# Vite Config Fix für Walter Braun Umzüge
# Repariert vite.config.ts Pfad-Problem

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🔧 VITE CONFIG FIX - Repariere vite.config.ts..."

cd "$PROJECT_DIR"

# 1. Aktuelle vite.config.ts sichern
echo "💾 Sichere aktuelle vite.config.ts..."
cp vite.config.ts vite.config.ts.backup

# 2. Alternative Lösung: NODE_OPTIONS setzen für import.meta Unterstützung
echo "📝 Setze NODE_OPTIONS für import.meta Unterstützung..."
export NODE_OPTIONS="--experimental-modules --experimental-specifier-resolution=node"

# 3. Dockerfile anpassen für Environment Variable
echo "📝 Aktualisiere Dockerfile..."
sed -i '/ENV NODE_ENV=development/a ENV NODE_OPTIONS="--experimental-modules"' Dockerfile || echo "NODE_OPTIONS bereits gesetzt"

# 3. Container stoppen
echo "🛑 Stoppe Web Container..."
docker compose stop web

# 4. Container neu bauen
echo "🔨 Baue Web Container mit neuer Konfiguration..."
docker compose build --no-cache web

# 5. Container starten
echo "🚀 Starte Web Container..."
docker compose up -d web

# 6. Warten auf Start
echo "⏳ Warte auf Container Start..."
for i in {1..60}; do
    if docker compose logs web --tail=5 | grep -q "serving on port 5000"; then
        echo "✅ Web Container läuft!"
        break
    fi
    echo "⏳ Warte... ($i/60)"
    sleep 2
done

# 7. Status prüfen
echo ""
echo "📊 Container Status:"
docker compose ps

echo ""
echo "📋 Aktuelle Logs:"
docker compose logs web --tail=10

# 8. Tests
echo ""
echo "🧪 Teste Services..."

# Health Check
if curl -f -s http://localhost:5000/health >/dev/null 2>&1; then
    echo "✅ Health Check: OK"
else
    echo "❌ Health Check: FAIL"
fi

# Hauptseite
if curl -f -s http://localhost >/dev/null 2>&1; then
    echo "✅ Hauptseite: OK"
else
    echo "❌ Hauptseite: FAIL"
fi

echo ""
echo "🎯 ERGEBNIS:"
if curl -f -s http://localhost:5000/health >/dev/null 2>&1; then
    echo "🎉 SUCCESS! Vite Config Problem gelöst!"
    echo "🌐 Website: http://$(hostname -I | awk '{print $1}')"
    echo "🏥 Health: http://$(hostname -I | awk '{print $1}')/health"
else
    echo "⚠️  Container startet noch - prüfen Sie die Logs:"
    echo "   docker compose logs web --follow"
fi

echo ""
echo "📋 Backup erstellt: vite.config.ts.backup"
echo "📋 Für vollständige Diagnose: curl -fsSL https://raw.githubusercontent.com/zeeeero43/braun/main/status-check.sh | bash"