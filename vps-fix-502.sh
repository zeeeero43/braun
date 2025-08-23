#!/bin/bash

# VPS 502 Bad Gateway Fix
# Behebt nginx upstream connection Probleme

echo "🔧 VPS 502 Bad Gateway Diagnose & Fix"
echo "====================================="

# Farben
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}✅ $1${NC}"; }
log_warn() { echo -e "${YELLOW}⚠️ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_debug() { echo -e "${BLUE}🔍 $1${NC}"; }

# Docker Compose Befehl bestimmen
if command -v docker-compose &> /dev/null; then
    DOCKER_CMD="docker-compose"
else
    DOCKER_CMD="docker compose"
fi

echo ""
log_debug "Schritt 1: Container Status prüfen"

echo "Container Status:"
$DOCKER_CMD ps

echo ""
log_debug "Schritt 2: Web Container Logs anzeigen"

echo "Letzte 20 Log-Zeilen vom Web Container:"
$DOCKER_CMD logs --tail=20 web

echo ""
log_debug "Schritt 3: Interne Container-Konnektivität testen"

# Teste ob web container erreichbar ist
web_internal=$(docker exec walter_braun_nginx wget -qO- --timeout=5 http://web:5000/api/blog 2>/dev/null | head -c 100)

if [ -n "$web_internal" ]; then
    log_info "Web Container intern erreichbar"
else
    log_error "Web Container NICHT intern erreichbar"
    
    echo ""
    log_debug "Schritt 4: Web Container neustarten"
    
    $DOCKER_CMD restart web
    
    sleep 10
    
    # Nochmal testen
    web_internal_retry=$(docker exec walter_braun_nginx wget -qO- --timeout=5 http://web:5000/api/blog 2>/dev/null | head -c 100)
    
    if [ -n "$web_internal_retry" ]; then
        log_info "Web Container nach Neustart erreichbar"
    else
        log_error "Web Container noch immer nicht erreichbar"
        
        echo ""
        log_debug "Schritt 5: Kompletter Neustart aller Container"
        
        $DOCKER_CMD down
        sleep 5
        $DOCKER_CMD up -d
        
        log_info "Alle Container neugestartet, warte 15 Sekunden..."
        sleep 15
    fi
fi

echo ""
log_debug "Schritt 6: Finale Tests"

# HTTP Test
http_status=$(curl -s -o /dev/null -w "%{http_code}" http://walterbraun-muenchen.de 2>/dev/null)
echo "HTTP Status: $http_status"

# API Test
api_status=$(curl -s -o /dev/null -w "%{http_code}" http://walterbraun-muenchen.de/api/blog 2>/dev/null)
echo "API Status: $api_status"

# Test auch über localhost
local_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/blog 2>/dev/null)
echo "Localhost Status: $local_status"

echo ""
if [ "$http_status" = "200" ] || [ "$api_status" = "200" ]; then
    log_info "✅ Website funktioniert wieder!"
    echo "🌐 http://walterbraun-muenchen.de"
else
    log_error "❌ Problem besteht weiterhin"
    
    echo ""
    echo "🔍 Zusätzliche Diagnose:"
    echo "1. Container Status:"
    $DOCKER_CMD ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo "2. Aktuelle nginx.conf:"
    if [ -f "nginx.conf" ]; then
        echo "--- nginx.conf upstream ---"
        grep -A5 "upstream" nginx.conf || echo "Kein upstream gefunden"
        echo "--- nginx.conf server ---"
        grep -A10 "server {" nginx.conf || echo "Keine server config gefunden"
    else
        log_error "nginx.conf nicht gefunden!"
    fi
fi

echo ""
echo "💡 Wenn Problem weiterhin besteht:"
echo "   - $DOCKER_CMD logs -f web    # Live-Logs anzeigen"
echo "   - $DOCKER_CMD down && $DOCKER_CMD up -d    # Kompletter Neustart"
echo "   - docker exec -it walter_braun_web curl http://localhost:5000/api/blog    # Direkter Test"