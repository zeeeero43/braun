#!/bin/bash

echo "🚨 VPS Dockerfile Fix - Entferne TypeScript-Kompilierung"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Gehe zum Projekt-Verzeichnis
cd /opt/walter-braun-umzuege

# Sichere aktuelles Dockerfile
cp Dockerfile.production Dockerfile.production.backup.$(date +%s)

# Zeige die problematische Zeile
echo "❌ Problematische Zeile gefunden:"
grep -n "npx tsc server/serve-prod.ts" Dockerfile.production || echo "Zeile nicht gefunden"

# Entferne die TypeScript-Kompilierungszeile
sed -i '/npx tsc server\/serve-prod\.ts/d' Dockerfile.production

echo "✅ TypeScript-Kompilierung entfernt!"

# Prüfe das Ergebnis
echo "📋 Dockerfile Build-Sektion:"
sed -n '15,25p' Dockerfile.production

echo "🔄 Starte Docker-Rebuild..."

# Stoppe alte Container
docker compose down

# Rebuild mit korrigiertem Dockerfile
docker compose up --build -d

echo "⏱️ Warte 15 Sekunden auf Container-Start..."
sleep 15

echo "📊 Container Status:"
docker compose ps

echo "🏥 Health Check:"
curl -f http://localhost/health && echo "✅ Website läuft!" || echo "❌ Noch nicht bereit"

echo "📋 Web Container Logs (letzte 10 Zeilen):"
docker compose logs web --tail 10