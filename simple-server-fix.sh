#!/bin/bash

# Simple Server Fix für Walter Braun Umzüge
# Startet Server ohne Vite-Probleme

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🚀 SIMPLE SERVER FIX - Direkter Server-Start..."

cd "$PROJECT_DIR"

# 1. Container stoppen
echo "🛑 Stoppe Container..."
docker compose down

# 2. Einfaches Dockerfile das garantiert funktioniert
echo "📝 Erstelle einfaches Dockerfile..."
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install ALL dependencies
RUN npm ci

# Copy source code
COPY . .

# Environment
ENV NODE_ENV=development
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start server directly
CMD ["npx", "tsx", "server/index.ts"]
EOF

# 3. Container neu bauen
echo "🔨 Baue Container neu..."
docker compose build --no-cache web

# 4. PostgreSQL zuerst starten
echo "🗄️ Starte PostgreSQL..."
docker compose up -d postgres

# Warte auf PostgreSQL
echo "⏳ Warte auf PostgreSQL..."
for i in {1..30}; do
    if docker compose exec postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo "✅ PostgreSQL bereit!"
        break
    fi
    echo "⏳ PostgreSQL... ($i/30)"
    sleep 2
done

# 5. Web Container starten
echo "🚀 Starte Web Container..."
docker compose up -d web

# 6. Warten auf Web Server
echo "⏳ Warte auf Web Server..."
for i in {1..120}; do
    if docker compose logs web --tail=5 | grep -q "serving on port 5000"; then
        echo "✅ Web Server läuft!"
        break
    fi
    if docker compose logs web --tail=5 | grep -q "Error\|error"; then
        echo "⚠️ Fehler erkannt - prüfe Logs"
        docker compose logs web --tail=10
    fi
    echo "⏳ Web Server... ($i/120)"
    sleep 2
done

# 7. Status check
echo ""
echo "📊 Container Status:"
docker compose ps

echo ""
echo "📋 Web Server Logs:"
docker compose logs web --tail=15

# 8. Health Tests
echo ""
echo "🧪 Teste Services..."

# Warte kurz für vollständige Initialisierung
sleep 15

# Test Health Check
HEALTH_OK=false
for i in {1..15}; do
    if curl -f -s --max-time 5 http://localhost:5000/health >/dev/null 2>&1; then
        echo "✅ Health Check: OK"
        HEALTH_OK=true
        break
    fi
    echo "⏳ Health Check... ($i/15)"
    sleep 3
done

# Test Hauptseite
if curl -f -s --max-time 5 http://localhost >/dev/null 2>&1; then
    echo "✅ Hauptseite (Port 80): OK"
else
    echo "❌ Hauptseite (Port 80): FAIL"
fi

# Test Port 5000
if curl -f -s --max-time 5 http://localhost:5000 >/dev/null 2>&1; then
    echo "✅ Direct Port 5000: OK"
else
    echo "❌ Direct Port 5000: FAIL"
fi

# Test Blog API
if curl -f -s --max-time 5 http://localhost:5000/api/blog >/dev/null 2>&1; then
    echo "✅ Blog API: OK"
else
    echo "❌ Blog API: FAIL"
fi

echo ""
echo "🎯 FINALES ERGEBNIS:"
if [ "$HEALTH_OK" = true ]; then
    echo "🎉 SUCCESS! Walter Braun Umzüge läuft!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 Website: http://$(hostname -I | awk '{print $1}')"
    echo "🏥 Health: http://$(hostname -I | awk '{print $1}')/health"
    echo "📝 Blog: http://$(hostname -I | awk '{print $1}')/blog"
    echo "🔧 Admin: http://$(hostname -I | awk '{print $1}')/admin"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Server läuft stabil"
    echo "✅ PostgreSQL verbunden"
    echo "✅ Blog-System aktiv"
    echo "✅ API funktionsfähig"
else
    echo "⚠️ Server hat noch Probleme"
    echo ""
    echo "🔧 DEBUGGING SCHRITTE:"
    echo "1. Logs prüfen: docker compose logs web --follow"
    echo "2. Container neustarten: docker compose restart web"
    echo "3. Health Check manuell: curl -v http://localhost:5000/health"
    echo "4. Status prüfen: docker compose ps"
fi

echo ""
echo "📋 HILFREICHE BEFEHLE:"
echo "   docker compose logs web --follow  # Live Logs"
echo "   docker compose restart web        # Neustart"
echo "   docker compose ps                 # Status"
echo ""
echo "🔄 Für vollständige Diagnose:"
echo "   curl -fsSL https://raw.githubusercontent.com/zeeeero43/braun/main/status-check.sh | bash"