#!/bin/bash

# Schneller Domain-Fix für walterbraun-muenchen.de
# ===============================================

DOMAIN="walterbraun-muenchen.de"

echo "🔧 Quick Domain Fix für $DOMAIN"
echo "================================"

# Check if SSL cert exists
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo "✅ SSL-Zertifikat vorhanden"
    
    # Restart nginx and containers
    echo "🔄 Starte Services neu..."
    systemctl restart nginx
    
    cd /opt/walter-braun-umzuege
    docker compose -f docker-compose.production.yml restart
    
    # Wait and test
    sleep 10
    
    echo "🔍 Testing..."
    if curl -s https://$DOMAIN/health > /dev/null; then
        echo "✅ Website läuft: https://$DOMAIN"
    else
        echo "❌ Website nicht erreichbar"
        echo "🔍 Logs:"
        docker compose -f docker-compose.production.yml logs web --tail=10
    fi
else
    echo "❌ SSL-Zertifikat fehlt"
    echo "🚀 Führe vollständiges Setup aus:"
    echo "   sudo ./vps-domain-ssl-setup.sh"
fi