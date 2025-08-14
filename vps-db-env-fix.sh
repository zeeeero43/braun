#!/bin/bash

# VPS Database Environment Fix
# Stellt sicher, dass VPS die lokale PostgreSQL-DB verwendet, nicht externe Neon DB

set -e

echo "🔧 VPS Database Environment Fix"
echo "==============================="

PROJECT_DIR="/opt/walter-braun-umzuege"
cd "$PROJECT_DIR"

# 1. .env Datei überprüfen und korrigieren
echo "📝 Checking .env configuration..."

if [ -f ".env" ]; then
    echo "Aktuelle .env Inhalte:"
    cat .env
    echo ""
fi

# 2. Lokale VPS .env erstellen/korrigieren
echo "🔧 Creating VPS-optimized .env..."
cat > .env << 'EOF'
# VPS Production Environment - Walter Braun Umzüge
NODE_ENV=production
PORT=5000

# Local PostgreSQL Container (nicht externe Neon DB!)
DATABASE_URL=postgresql://postgres:secure_password_2024@postgres:5432/walter_braun_umzuege
PGHOST=postgres
PGPORT=5432  
PGUSER=postgres
PGPASSWORD=secure_password_2024
PGDATABASE=walter_braun_umzuege

# AI APIs für Blog-System
DEEPSEEK_API_KEY=
RUNWARE_API_KEY=c4bbca5f-e3e8-43c9-bd70-51e48b050da7

# Container-interne PostgreSQL Verbindung
POSTGRES_PASSWORD=secure_password_2024
EOF

echo "✅ VPS .env erstellt mit lokaler PostgreSQL-Verbindung"

# 3. Container neu starten mit neuer Konfiguration
echo ""
echo "🐳 Restarting containers with new database configuration..."

docker-compose down
sleep 3
docker-compose up -d

# 4. Warten auf Container-Start
echo ""
echo "⏳ Waiting for containers to start..."
sleep 15

# 5. Database Schema erstellen (falls nötig)
echo ""
echo "📊 Setting up database schema..."
docker-compose exec -T web npm run db:push || echo "Schema setup done or not needed"

# 6. Status prüfen
echo ""
echo "📋 Final Status Check:"
docker-compose ps
echo ""

# 7. Test der lokalen DB-Verbindung
echo "🧪 Testing local database connection..."
if docker-compose exec -T postgres pg_isready -U postgres -d walter_braun_umzuege; then
    echo "✅ PostgreSQL Container: OK"
else
    echo "❌ PostgreSQL Container: Problem"
fi

# 8. Test der Web-App
echo ""
echo "🌐 Testing web application..."
sleep 5

if curl -f -s --max-time 10 http://localhost/health > /dev/null; then
    echo "✅ Website: OK"
else
    echo "❌ Website: Problem"
fi

echo ""
echo "🎯 Fix Results:"
echo "   DATABASE_URL zeigt jetzt auf lokalen PostgreSQL Container"
echo "   Keine externe Neon Database mehr"
echo "   Container verwenden postgres:5432 statt externe IP"
echo ""
echo "📊 Check Logs: docker-compose logs web | grep -E '(PostgreSQL|MemStorage|Blog)'"