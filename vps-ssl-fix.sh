#!/bin/bash

# VPS SSL Fix - Verwendet existierende Zertifikate statt neue zu erstellen
# Verwendung: ./vps-ssl-fix.sh

echo "🔒 VPS SSL Fix - Existierende Zertifikate verwenden"
echo "=================================================="

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

echo "🔍 Schritt 1: Existierende Zertifikate prüfen..."

# Prüfe existierende Zertifikate
if [ -d "/etc/letsencrypt/live/walterbraun-muenchen.de" ]; then
    log_info "SSL-Zertifikate gefunden: /etc/letsencrypt/live/walterbraun-muenchen.de"
    
    # Zertifikat Details anzeigen
    cert_info=$(openssl x509 -in /etc/letsencrypt/live/walterbraun-muenchen.de/cert.pem -text -noout | grep "Not After" | cut -d: -f2-)
    echo "📅 Zertifikat gültig bis:$cert_info"
    
    # Prüfe ob Zertifikat noch gültig
    if openssl x509 -checkend 86400 -noout -in /etc/letsencrypt/live/walterbraun-muenchen.de/cert.pem; then
        log_info "Zertifikat ist noch gültig (mehr als 24h)"
        USE_EXISTING=true
    else
        log_warn "Zertifikat läuft bald ab"
        USE_EXISTING=false
    fi
else
    log_error "Keine SSL-Zertifikate gefunden"
    USE_EXISTING=false
fi

echo ""
echo "🔄 Schritt 2: Container mit SSL konfigurieren..."

if [ "$USE_EXISTING" = true ]; then
    # Verwende existierende Zertifikate
    log_info "Verwende existierende SSL-Zertifikate"
    
    # Erstelle nginx.conf mit SSL
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream walter_braun_web {
        server web:5000;
    }

    server {
        listen 80;
        server_name walterbraun-muenchen.de www.walterbraun-muenchen.de;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name walterbraun-muenchen.de www.walterbraun-muenchen.de;

        ssl_certificate /etc/letsencrypt/live/walterbraun-muenchen.de/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/walterbraun-muenchen.de/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers off;

        location / {
            proxy_pass http://walter_braun_web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF
    
    log_info "nginx.conf mit SSL konfiguriert"
    
else
    log_warn "Rate Limit aktiv - verwende HTTP only"
    
    # Erstelle nginx.conf ohne SSL
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream walter_braun_web {
        server web:5000;
    }

    server {
        listen 80;
        server_name walterbraun-muenchen.de www.walterbraun-muenchen.de;

        location / {
            proxy_pass http://walter_braun_web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

    log_info "nginx.conf für HTTP konfiguriert"
fi

echo ""
echo "🔄 Schritt 3: Container neustarten..."

# Container neustarten
$DOCKER_CMD down
sleep 2
$DOCKER_CMD up -d

if [ $? -eq 0 ]; then
    log_info "Container erfolgreich gestartet"
else
    log_error "Container Start fehlgeschlagen"
    exit 1
fi

echo ""
echo "🔍 Schritt 4: Status prüfen..."

# Kurz warten
sleep 10

# HTTP Test
http_status=$(curl -s -o /dev/null -w "%{http_code}" http://walterbraun-muenchen.de 2>/dev/null)
echo "HTTP Status: $http_status"

if [ "$USE_EXISTING" = true ]; then
    # HTTPS Test
    https_status=$(curl -s -k -o /dev/null -w "%{http_code}" https://walterbraun-muenchen.de 2>/dev/null)
    echo "HTTPS Status: $https_status"
    
    if [ "$https_status" = "200" ]; then
        log_info "✅ HTTPS funktioniert: https://walterbraun-muenchen.de"
    else
        log_warn "HTTPS Problem - verwende HTTP"
    fi
else
    if [ "$http_status" = "200" ]; then
        log_info "✅ HTTP funktioniert: http://walterbraun-muenchen.de"
    fi
fi

echo ""
echo "📊 Zusammenfassung:"
echo "=================="
if [ "$USE_EXISTING" = true ]; then
    log_info "SSL: Existierende Zertifikate verwendet"
    log_info "Website: https://walterbraun-muenchen.de"
else
    log_warn "SSL: Rate Limit aktiv - warten bis 25. August 2025"
    log_info "Website: http://walterbraun-muenchen.de"
fi

echo ""
echo "💡 Hinweis: Let's Encrypt Rate Limit = 5 Zerts/Woche"
echo "Nächste Zertifikat-Erstellung möglich: 25. August 2025"