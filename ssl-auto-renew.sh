#!/bin/bash

echo "🔒 SSL Auto-Renewal Script für Walter Braun Umzüge"
echo "=================================================="
echo "Zeitstempel: $(date)"

DOMAIN="walterbraun-muenchen.de"
PROJECT_DIR="/opt/walter-braun-umzuege"
LOG_FILE="/var/log/ssl-renewal.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🔄 Starte SSL-Erneuerung für $DOMAIN..."

cd "$PROJECT_DIR" || { log "❌ Projektverzeichnis nicht gefunden"; exit 1; }

log "1. Container stoppen für SSL-Erneuerung..."
docker compose down

log "2. Certbot-Erneuerung ausführen..."
sudo certbot renew --standalone --preferred-challenges http --force-renewal

if [ $? -eq 0 ]; then
    log "✅ Certbot-Erneuerung erfolgreich"
else
    log "⚠️ Certbot Renewal fehlgeschlagen, versuche Neuausstellung..."
    sudo fuser -k 80/tcp 443/tcp 2>/dev/null
    sleep 2
    
    sudo certbot certonly --standalone \
        --preferred-challenges http \
        --email info@walterbraun-umzuege.de \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        --force-renewal
fi

log "3. Zertifikate ins Projekt kopieren..."
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    sudo mkdir -p "$PROJECT_DIR/ssl"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$PROJECT_DIR/ssl/"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$PROJECT_DIR/ssl/"
    sudo chown -R 1000:1000 "$PROJECT_DIR/ssl"
    sudo chmod 644 "$PROJECT_DIR/ssl/"*.pem
    log "✅ Zertifikate kopiert"
else
    log "❌ Zertifikate nicht gefunden in /etc/letsencrypt/live/$DOMAIN"
    docker compose up -d
    exit 1
fi

log "4. Container neu starten..."
docker compose up -d

log "5. Warte auf Container-Start (30s)..."
sleep 30

log "6. SSL-Test..."
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" 2>/dev/null)

if [ "$HTTPS_STATUS" = "200" ] || [ "$HTTPS_STATUS" = "301" ] || [ "$HTTPS_STATUS" = "302" ]; then
    log "✅ SSL funktioniert! HTTPS Status: $HTTPS_STATUS"
else
    log "⚠️ HTTPS Status: $HTTPS_STATUS - bitte manuell prüfen"
fi

log "7. Zertifikat-Ablaufdatum prüfen..."
EXPIRY=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
log "📅 Zertifikat gültig bis: $EXPIRY"

log ""
log "=================================================="
log "✅ SSL Auto-Renewal abgeschlossen!"
log "=================================================="
