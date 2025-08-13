#!/bin/bash

# Walter Braun Umzüge - Docker Status Check
# Prüft den aktuellen Status aller Container

echo "🐳 Walter Braun Umzüge - Container Status"
echo "========================================="

# 1. Container Status
echo "📊 Container Status:"
docker compose ps

echo ""
echo "📋 Container Logs (letzte 10 Zeilen):"
echo "--- Web Container ---"
docker compose logs web --tail=10

echo ""
echo "--- Database Container ---"
docker compose logs postgres --tail=5

# 2. Health Checks
echo ""
echo "🧪 Health Checks:"

# Web Container Health
if curl -f -s --max-time 5 http://localhost/health >/dev/null 2>&1; then
    echo "✅ Web Container (Port 80): OK"
else
    echo "❌ Web Container (Port 80): FAIL"
fi

# Direct Port Check
if curl -f -s --max-time 5 http://localhost:5000/health >/dev/null 2>&1; then
    echo "✅ Direct Web (Port 5000): OK"
else
    echo "❌ Direct Web (Port 5000): FAIL"
fi

# Database Check
if docker compose exec postgres pg_isready -U postgres >/dev/null 2>&1; then
    echo "✅ PostgreSQL Database: OK"
else
    echo "❌ PostgreSQL Database: FAIL"
fi

echo ""
echo "🌐 URLs:"
echo "   Hauptseite: http://$(hostname -I | awk '{print $1}')"
echo "   Health Check: http://$(hostname -I | awk '{print $1}')/health"
echo "   Nginx (Port 8080): http://$(hostname -I | awk '{print $1}'):8080"

echo ""
echo "🛠️ Useful Commands:"
echo "   docker compose logs web -f    # Web Container Logs"
echo "   docker compose restart web    # Restart Web"
echo "   docker compose down && docker compose up -d  # Full Restart"