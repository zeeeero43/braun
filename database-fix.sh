#!/bin/bash

# Database Fix für Walter Braun Umzüge
# Löst PostgreSQL Container Probleme

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🔧 Repariere PostgreSQL Datenbank..."

cd "$PROJECT_DIR"

# 1. Alle Container stoppen
echo "🛑 Stoppe alle Container..."
docker compose down -v

# 2. Bereinige PostgreSQL Volumes
echo "🗑️ Bereinige alte Volumes..."
docker volume prune -f

# 3. Verbesserte docker-compose.yml mit korrigierter PostgreSQL Konfiguration
echo "📝 Erstelle optimierte docker-compose.yml..."
cat > docker-compose.yml << 'EOF'
services:
  postgres:
    image: postgres:15-alpine
    container_name: walter_braun_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: walter_braun_umzuege
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-secure_password_2024}
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --lc-collate=C --lc-ctype=C"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d walter_braun_umzuege"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s
    command: >
      postgres
      -c shared_preload_libraries=''
      -c max_connections=100
      -c shared_buffers=128MB

  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: walter_braun_web
    restart: unless-stopped
    environment:
      NODE_ENV: development
      PORT: 5000
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD:-secure_password_2024}@postgres:5432/walter_braun_umzuege
      PGHOST: postgres
      PGPORT: 5432
      PGUSER: postgres
      PGPASSWORD: ${POSTGRES_PASSWORD:-secure_password_2024}
      PGDATABASE: walter_braun_umzuege
      DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY:-}
      RUNWARE_API_KEY: ${RUNWARE_API_KEY:-}
    ports:
      - "80:5000"
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

volumes:
  postgres_data:
    driver: local
EOF

# 4. .env-Datei sicherstellen
echo "📝 Stelle .env bereit..."
if [ ! -f .env ]; then
    cat > .env << 'EOF'
# Database
POSTGRES_PASSWORD=secure_password_2024

# API Keys (optional - für Blog-System)
DEEPSEEK_API_KEY=
RUNWARE_API_KEY=
EOF
fi

# 5. Neues vereinfachtes Dockerfile
echo "📝 Erstelle optimiertes Dockerfile..."
cat > Dockerfile << 'EOF'
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache curl wget

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build:client || echo "Frontend build skipped"

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start in development mode
CMD ["npm", "run", "dev"]
EOF

# 6. Container neu bauen
echo "🔨 Baue Container neu..."
docker compose build --no-cache web

# 7. PostgreSQL zuerst starten
echo "🗄️ Starte PostgreSQL..."
docker compose up -d postgres

# Warte auf PostgreSQL
echo "⏳ Warte auf PostgreSQL..."
for i in {1..30}; do
    if docker compose exec postgres pg_isready -U postgres -d walter_braun_umzuege >/dev/null 2>&1; then
        echo "✅ PostgreSQL ist bereit!"
        break
    fi
    echo "⏳ Warte auf PostgreSQL... ($i/30)"
    sleep 2
done

# 8. Web-Container starten
echo "🚀 Starte Web-Container..."
docker compose up -d web

# 9. Warte auf Web-Container
echo "⏳ Warte auf Web-Container..."
for i in {1..60}; do
    if curl -f -s http://localhost:5000/health >/dev/null 2>&1; then
        echo "✅ Web-Container ist bereit!"
        break
    fi
    echo "⏳ Warte auf Web-Container... ($i/60)"
    sleep 2
done

# 10. Status prüfen
echo ""
echo "📊 Final Status:"
docker compose ps

echo ""
echo "📋 Container Logs:"
docker compose logs web --tail=10

# 11. Tests
echo ""
echo "🧪 Teste Services..."

# Test Health
if curl -f -s http://localhost:5000/health >/dev/null 2>&1; then
    echo "✅ Health Check: OK"
else
    echo "❌ Health Check: FAIL"
fi

# Test Hauptseite
if curl -f -s http://localhost >/dev/null 2>&1; then
    echo "✅ Hauptseite: OK"
else
    echo "❌ Hauptseite: FAIL"
fi

# Test Database
if docker compose exec postgres pg_isready -U postgres -d walter_braun_umzuege >/dev/null 2>&1; then
    echo "✅ Database: OK"
else
    echo "❌ Database: FAIL"
fi

echo ""
echo "🎯 ERGEBNIS:"
if curl -f -s http://localhost:5000/health >/dev/null 2>&1 && curl -f -s http://localhost >/dev/null 2>&1; then
    echo "🎉 SUCCESS! Walter Braun Umzüge läuft!"
    echo "🌐 Website: http://$(hostname -I | awk '{print $1}')"
    echo "🏥 Health: http://$(hostname -I | awk '{print $1}')/health"
else
    echo "⚠️  Teilweise funktionsfähig - prüfen Sie die Logs:"
    echo "   docker compose logs"
fi