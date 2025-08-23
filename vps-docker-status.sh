#!/bin/bash

# VPS Docker Status Check - Prüft Status der Container und Services
# Verwendung: ./vps-docker-status.sh

echo "🐳 VPS Docker Status Check"
echo "=========================="

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "${BLUE}🔍 $1${NC}"
}

# 1. Docker Compose Status
log_header "Docker Compose Status"
if [ -f "docker-compose.yml" ]; then
    log_info "docker-compose.yml gefunden"
    
    # Bestimme korrekten Docker Compose Befehl
    if command -v docker-compose &> /dev/null; then
        DOCKER_CMD="docker-compose"
    else
        DOCKER_CMD="docker compose"
    fi
    
    echo "Container Status:"
    $DOCKER_CMD ps
    
    echo ""
    echo "Service Health:"
    $DOCKER_CMD ps --services | while read service; do
        status=$($DOCKER_CMD ps -q $service | xargs docker inspect -f '{{.State.Status}}' 2>/dev/null)
        if [ "$status" = "running" ]; then
            log_info "$service: $status"
        else
            log_error "$service: $status"
        fi
    done
else
    log_error "docker-compose.yml nicht gefunden!"
fi

echo ""

# 2. Web Service Test
log_header "Web Service Connectivity"

# HTTP Test
http_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null)
echo "HTTP (Port 80): $http_status"

# HTTPS Test  
https_status=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost/ 2>/dev/null)
echo "HTTPS (Port 443): $https_status"

# API Test
api_status=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost/api/blog 2>/dev/null)
echo "API (/api/blog): $api_status"

echo ""

# 3. Database Connectivity
log_header "Database Connectivity"

# Bestimme korrekten Docker Compose Befehl
if command -v docker-compose &> /dev/null; then
    DOCKER_CMD="docker-compose"
else
    DOCKER_CMD="docker compose"
fi

if $DOCKER_CMD ps | grep -q "postgres"; then
    log_info "Database Container gefunden"
    
    # Test DB Connection
    db_test=$($DOCKER_CMD exec -T postgres psql -U postgres -d walter_braun_umzuege -c "SELECT 1;" 2>/dev/null)
    if [ $? -eq 0 ]; then
        log_info "PostgreSQL Verbindung erfolgreich"
        
        # Blog Posts zählen
        blog_count=$($DOCKER_CMD exec -T postgres psql -U postgres -d walter_braun_umzuege -c "SELECT COUNT(*) FROM auto_blog_posts;" 2>/dev/null | grep -E '^\s*[0-9]+\s*$' | tr -d ' ')
        echo "Blog Posts in DB: $blog_count"
        
    else
        log_error "PostgreSQL Verbindung fehlgeschlagen"
    fi
else
    log_warn "Database Container nicht gefunden"
fi

echo ""

# 4. Environment Check
log_header "Environment Check"

# Check if environment files exist
if [ -f ".env" ]; then
    log_info ".env Datei gefunden"
    
    # Check wichtige Variablen (ohne Werte zu zeigen)
    if grep -q "DATABASE_URL" .env; then
        log_info "DATABASE_URL konfiguriert"
    else
        log_warn "DATABASE_URL nicht in .env gefunden"
    fi
    
    if grep -q "DEEPSEEK_API_KEY" .env; then
        log_info "DEEPSEEK_API_KEY konfiguriert"
    else
        log_warn "DEEPSEEK_API_KEY nicht in .env gefunden"
    fi
    
    if grep -q "RUNWARE_API_KEY" .env; then
        log_info "RUNWARE_API_KEY konfiguriert"
    else
        log_warn "RUNWARE_API_KEY nicht in .env gefunden"
    fi
else
    log_warn ".env Datei nicht gefunden"
fi

echo ""

# 5. Logs (letzte 10 Zeilen)
log_header "Recent Logs (Web Container)"
echo "Letzte 10 Log-Zeilen vom Web Container:"
$DOCKER_CMD logs --tail=10 web 2>/dev/null || log_error "Logs nicht abrufbar"

echo ""
echo "💡 Nützliche Befehle:"
if command -v docker-compose &> /dev/null; then
    echo "   docker-compose up -d        # Alle Services starten"
    echo "   docker-compose restart web  # Web Service neustarten"  
    echo "   docker-compose logs -f web  # Live Logs anzeigen"
    echo "   docker-compose down         # Alle Services stoppen"
else
    echo "   docker compose up -d        # Alle Services starten"
    echo "   docker compose restart web  # Web Service neustarten"  
    echo "   docker compose logs -f web  # Live Logs anzeigen"
    echo "   docker compose down         # Alle Services stoppen"
fi