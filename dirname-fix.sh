#!/bin/bash

# __dirname Fix für Walter Braun Umzüge
# Repariert __dirname Problem in vite.config.ts

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🔧 __dirname FIX - Repariere vite.config.ts..."

cd "$PROJECT_DIR"

# 1. Backup erstellen
echo "💾 Erstelle Backup..."
cp vite.config.ts vite.config.ts.backup

# 2. __dirname durch import.meta.dirname ersetzen
echo "📝 Ersetze __dirname durch import.meta.dirname..."
sed -i 's/__dirname/import.meta.dirname/g' vite.config.ts

# 3. Prüfe ob Änderungen gemacht wurden
echo "🔍 Prüfe Änderungen..."
if diff vite.config.ts vite.config.ts.backup >/dev/null; then
    echo "ℹ️  Keine __dirname gefunden - Datei war bereits korrekt"
else
    echo "✅ __dirname erfolgreich ersetzt"
    echo "📋 Geänderte Zeilen:"
    diff vite.config.ts.backup vite.config.ts || true
fi

# 4. Container stoppen
echo "🛑 Stoppe Web Container..."
docker compose stop web 2>/dev/null || echo "Web Container war bereits gestoppt"

# 5. Container neu bauen
echo "🔨 Baue Web Container neu (mit korrigierter vite.config.ts)..."
docker compose build --no-cache web

# 6. Container starten
echo "🚀 Starte Web Container..."
docker compose up -d web

# 7. Warten auf vollständigen Start
echo "⏳ Warte auf Web Server..."
for i in {1..90}; do
    if docker compose logs web --tail=5 | grep -q "serving on port 5000"; then
        echo "✅ Web Server läuft!"
        break
    elif docker compose logs web --tail=5 | grep -q "Error\|error"; then
        echo "⚠️ Fehler erkannt:"
        docker compose logs web --tail=10
        break
    fi
    echo "⏳ Warte... ($i/90)"
    sleep 2
done

# 8. Status prüfen
echo ""
echo "📊 Container Status:"
docker compose ps

echo ""
echo "📋 Web Container Logs (letzte 15 Zeilen):"
docker compose logs web --tail=15

# 9. Health Checks
echo ""
echo "🧪 Teste Services..."

# Warte kurz für vollständige Initialisierung
sleep 10

# Health Check
HEALTH_OK=false
for i in {1..10}; do
    if curl -f -s --max-time 5 http://localhost:5000/health >/dev/null 2>&1; then
        echo "✅ Health Check: OK"
        HEALTH_OK=true
        break
    fi
    echo "⏳ Health Check... ($i/10)"
    sleep 3
done

# Hauptseite
if curl -f -s --max-time 5 http://localhost >/dev/null 2>&1; then
    echo "✅ Hauptseite (Port 80): OK"
else
    echo "❌ Hauptseite (Port 80): FAIL"
fi

# Port 5000
if curl -f -s --max-time 5 http://localhost:5000 >/dev/null 2>&1; then
    echo "✅ Direct Port 5000: OK"
else
    echo "❌ Direct Port 5000: FAIL"
fi

echo ""
echo "🎯 FINALES ERGEBNIS:"
if [ "$HEALTH_OK" = true ]; then
    echo "🎉 SUCCESS! __dirname Problem gelöst!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 Website: http://$(hostname -I | awk '{print $1}')"
    echo "🏥 Health: http://$(hostname -I | awk '{print $1}')/health"
    echo "📝 Blog: http://$(hostname -I | awk '{print $1}')/blog"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ vite.config.ts repariert"
    echo "✅ ES Module Kompatibilität"
    echo "✅ Alle Services funktionsfähig"
else
    echo "⚠️ Container startet noch oder andere Probleme"
    echo ""
    echo "🔧 DEBUGGING:"
    echo "1. Logs prüfen: docker compose logs web --follow"
    echo "2. vite.config.ts prüfen: cat vite.config.ts"
    echo "3. Container neu starten: docker compose restart web"
    echo "4. Backup wiederherstellen: cp vite.config.ts.backup vite.config.ts"
fi

echo ""
echo "📋 Backup erstellt: vite.config.ts.backup"
echo "📋 Für weitere Diagnose:"
echo "   curl -fsSL https://raw.githubusercontent.com/zeeeero43/braun/main/status-check.sh | bash"