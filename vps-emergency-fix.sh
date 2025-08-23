#!/bin/bash

# VPS Emergency Fix - Behebt den BlogScheduler Crash Loop
# Verwendung: ./vps-emergency-fix.sh

echo "🚑 VPS Emergency Fix - BlogScheduler Crash Loop"
echo "==============================================="

# Farben
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${GREEN}✅ $1${NC}"; }
log_warn() { echo -e "${YELLOW}⚠️ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Docker Compose Befehl bestimmen
if command -v docker-compose &> /dev/null; then
    DOCKER_CMD="docker-compose"
else
    DOCKER_CMD="docker compose"
fi

echo "🔄 Schritt 1: Container stoppen"
$DOCKER_CMD down

log_info "Container gestoppt"

echo ""
echo "🏗️ Schritt 2: Container neu bauen"
$DOCKER_CMD build --no-cache web

if [ $? -eq 0 ]; then
    log_info "Web Container erfolgreich neu gebaut"
else
    log_error "Build fehlgeschlagen"
    exit 1
fi

echo ""
echo "🚀 Schritt 3: Container starten"
$DOCKER_CMD up -d

if [ $? -eq 0 ]; then
    log_info "Container gestartet"
else
    log_error "Start fehlgeschlagen"
    exit 1
fi

echo ""
echo "⏳ Schritt 4: Warten auf Service (30 Sekunden)"
sleep 30

echo ""
echo "🔍 Schritt 5: Status prüfen"

# Container Status
echo "Container Status:"
$DOCKER_CMD ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Logs prüfen auf Errors
echo ""
echo "Aktuelle Web Container Logs:"
$DOCKER_CMD logs --tail=10 web

# Service Test
echo ""
echo "Service Tests:"

http_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/blog 2>/dev/null)
echo "HTTP Status: $http_status"

if [ "$http_status" = "200" ]; then
    log_info "✅ SUCCESS: Website funktioniert!"
    echo "🌐 http://walterbraun-muenchen.de"
    
    # Blog Posts zählen
    blog_count=$(curl -s http://localhost/api/blog 2>/dev/null | jq '.posts | length' 2>/dev/null || echo "0")
    echo "📝 Blog Posts: $blog_count"
    
else
    log_error "Service noch nicht erreichbar"
fi

echo ""
echo "💡 Falls Problem weiterhin besteht:"
echo "   $DOCKER_CMD logs -f web    # Live-Logs anzeigen"
echo "   $DOCKER_CMD exec -it walter_braun_web node -v    # Node Version prüfen"