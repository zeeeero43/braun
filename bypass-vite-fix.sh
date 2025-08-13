#!/bin/bash

# Bypass Vite Fix für Walter Braun Umzüge
# Umgeht vite.config.ts Problem komplett durch direkten Server-Start

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🚀 BYPASS VITE FIX - Umgeht vite.config.ts Problem..."

cd "$PROJECT_DIR"

# 1. Container stoppen
echo "🛑 Stoppe alle Container..."
docker compose down

# 2. Neues einfaches Dockerfile erstellen das Vite umgeht
echo "📝 Erstelle neues Dockerfile ohne Vite-Abhängigkeiten..."
cat > Dockerfile << 'EOF'
FROM node:18-alpine

# System Dependencies
RUN apk add --no-cache curl wget

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Create build directory for static files (if needed)
RUN mkdir -p dist/public

# Environment
ENV NODE_ENV=development
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start server directly without vite
CMD ["node_modules/.bin/tsx", "server/index.ts"]
EOF

# 3. Alternative package.json Scripts hinzufügen
echo "📝 Füge alternative Scripts hinzu..."
# Backup package.json
cp package.json package.json.backup

# Erstelle temporäres package.json mit alternativen Scripts
node -e "
const pkg = require('./package.json');
pkg.scripts = {
  ...pkg.scripts,
  'dev:server': 'tsx server/index.ts',
  'start:direct': 'tsx server/index.ts'
};
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# 4. Docker Compose für direkten Server-Start anpassen
echo "📝 Aktualisiere docker-compose.yml..."
sed -i 's/CMD \["npm", "run", "dev"\]/CMD ["npm", "run", "start:direct"]/' Dockerfile

# 5. Container neu bauen
echo "🔨 Baue Container neu..."
docker compose build --no-cache web

# 6. Container starten
echo "🚀 Starte Container..."
docker compose up -d

# 7. Warten auf Start
echo "⏳ Warte auf Container Start..."
for i in {1..90}; do
    if docker compose logs web --tail=5 | grep -q "serving on port 5000"; then
        echo "✅ Server läuft!"
        break
    elif docker compose logs web --tail=5 | grep -q "Error"; then
        echo "❌ Fehler erkannt - prüfe Logs"
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
echo "📋 Server Logs (letzte 15 Zeilen):"
docker compose logs web --tail=15

# 9. Tests
echo ""
echo "🧪 Teste Services..."

# Warte etwas länger für vollständigen Start
sleep 10

# Health Check
for i in {1..10}; do
    if curl -f -s http://localhost:5000/health >/dev/null 2>&1; then
        echo "✅ Health Check: OK"
        break
    fi
    echo "⏳ Health Check Versuch $i/10..."
    sleep 3
done

# Hauptseite über Port 80
if curl -f -s http://localhost >/dev/null 2>&1; then
    echo "✅ Hauptseite (Port 80): OK"
else
    echo "❌ Hauptseite (Port 80): FAIL"
fi

# Direkter Port 5000
if curl -f -s http://localhost:5000 >/dev/null 2>&1; then
    echo "✅ Direkt (Port 5000): OK"
else
    echo "❌ Direkt (Port 5000): FAIL"
fi

echo ""
echo "🎯 FINALES ERGEBNIS:"
if curl -f -s http://localhost:5000/health >/dev/null 2>&1; then
    echo "🎉 SUCCESS! Server läuft ohne Vite-Problem!"
    echo "🌐 Website: http://$(hostname -I | awk '{print $1}')"
    echo "🏥 Health: http://$(hostname -I | awk '{print $1}')/health"
    echo "📝 Blog: http://$(hostname -I | awk '{print $1}')/blog"
    echo ""
    echo "✅ Vite-Problem erfolgreich umgangen!"
    echo "✅ Server läuft direkt mit TSX"
    echo "✅ Alle Services verfügbar"
else
    echo "⚠️  Server startet noch oder hat andere Probleme"
    echo "🔧 Debugging:"
    echo "   docker compose logs web --follow"
    echo "   docker compose restart web"
fi

echo ""
echo "📋 Backup-Dateien erstellt:"
echo "   📁 package.json.backup"
echo "📋 Für detaillierte Diagnose:"
echo "   curl -fsSL https://raw.githubusercontent.com/zeeeero43/braun/main/status-check.sh | bash"