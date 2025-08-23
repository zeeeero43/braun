#!/bin/bash

# VPS Blog Manual Generation - Erstellt manuell einen neuen Blog-Post
# Verwendung: ./vps-blog-manual-generate.sh

echo "🤖 VPS Blog Manual Generation"
echo "============================="

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

# Service Status prüfen (VPS nutzt Port 80/443)
echo "🔍 Service Status prüfen..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/blog 2>/dev/null)

# Fallback zu HTTPS falls HTTP nicht funktioniert
if [ "$response" != "200" ]; then
    response=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost/api/blog 2>/dev/null)
    API_URL="https://localhost"
else
    API_URL="http://localhost"
fi

if [ "$response" != "200" ]; then
    log_error "Blog-Service nicht erreichbar! (HTTP $response)"
    log_warn "Bitte zuerst Service starten: docker-compose up -d"
    log_warn "Status prüfen: docker-compose ps"
    exit 1
fi

log_info "Blog-Service läuft ($API_URL)"

# Aktuelle Blog-Posts zählen
echo "📊 Aktuelle Blog-Posts zählen..."
current_count=$(curl -s -k $API_URL/api/blog 2>/dev/null | jq '.posts | length' 2>/dev/null || echo "0")
log_info "Aktuell: $current_count Blog-Posts"

# Neuen Blog-Post generieren
echo ""
echo "🚀 Neuen Blog-Post generieren..."
echo "Kategorie: München & Umgebung"

generate_response=$(curl -s -k -X POST $API_URL/api/admin/generate-blog \
  -H "Content-Type: application/json" \
  -d '{"category": "München & Umgebung"}' 2>/dev/null)

if [ $? -eq 0 ]; then
    log_info "Blog-Generation gestartet"
    
    # Warten auf Completion (bis zu 5 Minuten)
    echo "⏳ Warte auf Completion (max 5 Minuten)..."
    
    for i in {1..60}; do
        sleep 5
        new_count=$(curl -s -k $API_URL/api/blog 2>/dev/null | jq '.posts | length' 2>/dev/null || echo "0")
        
        if [ "$new_count" -gt "$current_count" ]; then
            log_info "Neuer Blog-Post erfolgreich erstellt!"
            echo "📈 Blog-Posts: $current_count → $new_count"
            
            # Neuesten Post anzeigen
            latest_post=$(curl -s -k $API_URL/api/blog 2>/dev/null | jq -r '.posts[0] | "Titel: \(.title)\nSlug: \(.slug)\nKategorie: \(.category)"' 2>/dev/null)
            echo ""
            log_info "Neuester Blog-Post:"
            echo "$latest_post"
            break
        fi
        
        echo -n "."
        
        if [ $i -eq 60 ]; then
            log_warn "Timeout erreicht - Generation läuft möglicherweise noch im Hintergrund"
        fi
    done
else
    log_error "Blog-Generation fehlgeschlagen"
    exit 1
fi

echo ""
log_info "Blog-Generation abgeschlossen!"
echo "🌐 Website prüfen: https://walterbraun-muenchen.de/blog"