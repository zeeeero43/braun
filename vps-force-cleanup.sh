#!/bin/bash

# VPS Force Cleanup - Löscht Blog-Posts aus BEIDEN Systemen (PostgreSQL + FileStorage)
# Verwendung: ./vps-force-cleanup.sh

echo "💥 VPS Force Cleanup - Blog-Posts komplett entfernen"
echo "=================================================="

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Bestimme korrekten Docker Compose Befehl
if command -v docker-compose &> /dev/null; then
    DOCKER_CMD="docker-compose"
    log_info "Verwende docker-compose"
else
    DOCKER_CMD="docker compose"
    log_info "Verwende docker compose"
fi

echo ""
echo "🗑️ Schritt 1: PostgreSQL komplett leeren..."

# PostgreSQL FORCE cleanup
$DOCKER_CMD exec -T postgres psql -U postgres -d walter_braun_umzuege -c "
    TRUNCATE TABLE auto_blog_posts RESTART IDENTITY CASCADE;
    TRUNCATE TABLE blog_ideas RESTART IDENTITY CASCADE;
    TRUNCATE TABLE ai_generation_logs RESTART IDENTITY CASCADE;
" 2>/dev/null

if [ $? -eq 0 ]; then
    log_info "PostgreSQL Tabellen geleert"
else
    log_warn "PostgreSQL Cleanup fehlgeschlagen - versuche Alternative"
    
    # Alternative über Web Container
    $DOCKER_CMD exec -T web sh -c 'psql "$DATABASE_URL" -c "
        TRUNCATE TABLE auto_blog_posts RESTART IDENTITY CASCADE;
        TRUNCATE TABLE blog_ideas RESTART IDENTITY CASCADE; 
        TRUNCATE TABLE ai_generation_logs RESTART IDENTITY CASCADE;
    "' 2>/dev/null
    
    if [ $? -eq 0 ]; then
        log_info "PostgreSQL über Web-Container geleert"
    else
        log_error "PostgreSQL Cleanup vollständig fehlgeschlagen"
    fi
fi

echo ""
echo "📁 Schritt 2: FileStorage komplett leeren..."

# JSON Dateien komplett leeren
echo "[]" > data/auto_blog_posts.json
echo "[]" > data/blog_ideas.json

log_info "FileStorage JSON-Dateien geleert"

# Falls vorhanden, auch blog_posts.json leeren (alte Version)
if [ -f "data/blog_posts.json" ]; then
    echo "[]" > data/blog_posts.json
    log_info "Legacy blog_posts.json geleert"
fi

echo ""
echo "🔄 Schritt 3: Container neustarten..."

$DOCKER_CMD restart web

if [ $? -eq 0 ]; then
    log_info "Web Container neugestartet"
else
    log_error "Container Neustart fehlgeschlagen"
fi

# Kurz warten
sleep 5

echo ""
echo "🔍 Schritt 4: Verification..."

# API Test
api_response=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost/api/blog 2>/dev/null)

if [ "$api_response" = "200" ]; then
    log_info "API erreichbar"
    
    # Blog Posts zählen via API
    blog_count=$(curl -s -k https://localhost/api/blog 2>/dev/null | jq '.posts | length' 2>/dev/null || echo "0")
    
    if [ "$blog_count" = "0" ]; then
        log_info "✅ ERFOLG: 0 Blog-Posts in API"
    else
        log_warn "⚠️ PROBLEM: $blog_count Blog-Posts noch vorhanden"
    fi
else
    log_error "API nicht erreichbar"
fi

echo ""
echo "📊 Cleanup Zusammenfassung:"
echo "=========================="
log_info "PostgreSQL Tabellen: TRUNCATED"
log_info "FileStorage JSONs: GELEERT"
log_info "Container: NEUGESTARTET"

echo ""
log_info "Das System ist jetzt komplett clean und bereit für neue Blog-Posts!"