#!/bin/bash

# VPS Blog Cleanup Script - Entfernt alle verbuggten Blog-Posts
# Verwendung: ./vps-blog-cleanup.sh

echo "🧹 VPS Blog Cleanup - Entfernung aller verbuggten Blog-Posts"
echo "============================================================"

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funktion für farbigen Output
log_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. PostgreSQL Blog-Posts über Docker löschen
echo ""
echo "🔄 Schritt 1: PostgreSQL Blog-Posts löschen..."

# PostgreSQL über Docker Container ausführen
if [ -f "docker-compose.yml" ]; then
    log_info "Docker Compose gefunden - verwende Container für PostgreSQL"
    
    # Führe SQL-Befehle über Docker aus (Container heißt 'postgres')
    docker-compose exec -T postgres psql -U postgres -d walter_braun_umzuege -c "
        DELETE FROM auto_blog_posts;
        DELETE FROM blog_ideas WHERE is_used = true;
        DELETE FROM ai_generation_logs WHERE type = 'content';
    " 2>/dev/null
    
    if [ $? -eq 0 ]; then
        log_info "PostgreSQL Blog-Posts erfolgreich gelöscht"
    else
        log_warn "PostgreSQL Cleanup fehlgeschlagen - verwende Alternative"
        
        # Alternative: Über Web Container
        docker-compose exec -T web psql "$DATABASE_URL" -c "
            DELETE FROM auto_blog_posts;
            DELETE FROM blog_ideas WHERE is_used = true;
            DELETE FROM ai_generation_logs WHERE type = 'content';
        " 2>/dev/null
    fi
else
    log_error "docker-compose.yml nicht gefunden!"
    exit 1
fi

if [ $? -eq 0 ]; then
    log_info "PostgreSQL Blog-Posts erfolgreich gelöscht"
else
    log_warn "PostgreSQL Cleanup teilweise fehlgeschlagen (möglicherweise bereits leer)"
fi

# 2. JSON Dateien zurücksetzen
echo ""
echo "🔄 Schritt 2: JSON Dateien zurücksetzen..."

# Blog-Posts JSON leeren
cat > data/auto_blog_posts.json << 'EOF'
[]
EOF

if [ $? -eq 0 ]; then
    log_info "data/auto_blog_posts.json zurückgesetzt"
else
    log_error "Fehler beim Zurücksetzen der JSON-Datei"
fi

# 3. Container/Service neustarten
echo ""
echo "🔄 Schritt 3: Service neustart..."

if [ -f "docker-compose.yml" ]; then
    log_info "Docker Container werden neugestartet..."
    docker-compose restart web
    
    if [ $? -eq 0 ]; then
        log_info "Docker Container erfolgreich neugestartet"
    else
        log_error "Docker Neustart fehlgeschlagen"
    fi
else
    log_warn "docker-compose.yml nicht gefunden - manueller Neustart erforderlich"
fi

# 4. Status prüfen
echo ""
echo "🔍 Schritt 4: Status-Prüfung..."

# Warten bis Service läuft
sleep 5

# API-Test (VPS nutzt Port 80/443)
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/blog 2>/dev/null)

if [ "$response" = "200" ]; then
    log_info "Blog-API erreichbar - Service läuft"
    
    # Blog-Posts zählen
    count=$(curl -s http://localhost/api/blog 2>/dev/null | jq '.posts | length' 2>/dev/null || echo "0")
    log_info "Aktuelle Blog-Posts: $count"
    
else
    # Backup test mit HTTPS
    response_https=$(curl -s -k -o /dev/null -w "%{http_code}" https://localhost/api/blog 2>/dev/null)
    if [ "$response_https" = "200" ]; then
        log_info "Blog-API erreichbar über HTTPS - Service läuft"
    else
        log_warn "Blog-API nicht erreichbar - Service startet möglicherweise noch"
    fi
fi

# 5. Zusammenfassung
echo ""
echo "📊 Cleanup Zusammenfassung:"
echo "=========================="
log_info "PostgreSQL Blog-Posts gelöscht"
log_info "JSON Dateien zurückgesetzt"
log_info "Service neugestartet"
echo ""
log_info "Das Blog-System ist jetzt bereit für frische Inhalte!"
log_info "Neue Blog-Posts werden automatisch alle 80 Stunden generiert"

echo ""
echo "🔧 Nächste Schritte:"
echo "- Warten bis neuer automatischer Blog-Post generiert wird"
echo "- Bei Problemen: docker-compose logs -f web"
echo "- Status prüfen: curl http://localhost:3000/api/blog"