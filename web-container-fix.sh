#!/bin/bash

# Web Container Fix für Walter Braun Umzüge
# Repariert fehlenden/gestoppten Web Container

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🔧 WEB CONTAINER FIX - Repariere fehlenden Web Container..."

cd "$PROJECT_DIR"

# 1. Aktueller Status
echo "📊 Aktueller Container Status:"
docker compose ps

# 2. Web Container Logs anzeigen (falls vorhanden)
echo ""
echo "📋 Web Container Logs:"
docker compose logs web --tail=20 2>/dev/null || echo "Keine Web Container Logs verfügbar"

# 3. Web Container stoppen und neu starten
echo ""
echo "🛑 Stoppe Web Container..."
docker compose stop web 2>/dev/null || echo "Web Container war bereits gestoppt"

echo "🗑️ Entferne alten Web Container..."
docker compose rm -f web 2>/dev/null || echo "Kein Web Container zum Entfernen"

# 4. Web Container neu bauen
echo "🔨 Baue Web Container neu..."
docker compose build --no-cache web

# 5. Web Container starten
echo "🚀 Starte Web Container..."
docker compose up -d web

# 6. Warten auf Start
echo "⏳ Warte auf Web Container Start..."
for i in {1..60}; do
    if docker compose ps web | grep -q "Up"; then
        echo "✅ Web Container ist gestartet!"
        break
    fi
    echo "⏳ Warte... ($i/60)"
    sleep 2
done

# 7. Health Check
echo ""
echo "🏥 Teste Health Check..."
for i in {1..30}; do
    if curl -f -s http://localhost:5000/health >/dev/null 2>&1; then
        echo "✅ Health Check erfolgreich!"
        break
    fi
    echo "⏳ Warte auf Health Check... ($i/30)"
    sleep 2
done

# 8. Status Check
echo ""
echo "📊 Finaler Status:"
docker compose ps

echo ""
echo "📋 Aktuelle Web Logs:"
docker compose logs web --tail=10

# 9. Tests
echo ""
echo "🧪 Finale Tests:"

# Test Health
if curl -f -s http://localhost:5000/health >/dev/null 2>&1; then
    echo "✅ Health Check: OK"
else
    echo "❌ Health Check: FAIL"
fi

# Test Hauptseite Port 80
if curl -f -s http://localhost >/dev/null 2>&1; then
    echo "✅ Hauptseite (Port 80): OK"
else
    echo "❌ Hauptseite (Port 80): FAIL"
fi

# Test direkter Port 5000
if curl -f -s http://localhost:5000 >/dev/null 2>&1; then
    echo "✅ Web App (Port 5000): OK"
else
    echo "❌ Web App (Port 5000): FAIL"
fi

echo ""
echo "🎯 ERGEBNIS:"
if curl -f -s http://localhost:5000/health >/dev/null 2>&1; then
    echo "🎉 SUCCESS! Web Container läuft wieder!"
    echo "🌐 Website: http://$(hostname -I | awk '{print $1}')"
    echo "🏥 Health: http://$(hostname -I | awk '{print $1}')/health"
    echo "📝 Blog: http://$(hostname -I | awk '{print $1}')/blog"
else
    echo "⚠️  PROBLEM: Web Container läuft noch nicht richtig"
    echo "🔧 Nächste Schritte:"
    echo "   1. Logs prüfen: docker compose logs web"
    echo "   2. Container neustarten: docker compose restart web"
    echo "   3. Komplett neu: docker compose down && docker compose up -d"
fi

echo ""
echo "📋 Für weitere Diagnose nutzen Sie:"
echo "   curl -fsSL https://raw.githubusercontent.com/zeeeero43/braun/main/status-check.sh | bash"