#!/bin/bash

# Walter Braun - Bestehende .env beibehalten und Domain setup
# =========================================================

DOMAIN="walterbraun-muenchen.de"
VPS_IP=$(hostname -I | awk '{print $1}')

echo "🔧 Walter Braun - Sichere bestehende API-Keys und richte Domain ein"
echo "=================================================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Bitte als root ausführen: sudo $0"
    exit 1
fi

# Backup existing .env if it exists
if [ -f "/opt/walter-braun-umzuege/.env" ]; then
    echo "✅ Bestehende .env gefunden - sichere API-Keys..."
    cp /opt/walter-braun-umzuege/.env /opt/walter-braun-umzuege/.env.backup
    
    # Extract existing API keys
    EXISTING_DEEPSEEK=$(grep "DEEPSEEK_API_KEY=" /opt/walter-braun-umzuege/.env | cut -d'=' -f2)
    EXISTING_RUNWARE=$(grep "RUNWARE_API_KEY=" /opt/walter-braun-umzuege/.env | cut -d'=' -f2)
    EXISTING_POSTGRES_PASSWORD=$(grep "POSTGRES_PASSWORD=" /opt/walter-braun-umzuege/.env | cut -d'=' -f2)
    
    echo "📋 Gefundene API-Keys:"
    echo "   DEEPSEEK: ${EXISTING_DEEPSEEK:0:20}..." 
    echo "   RUNWARE: ${EXISTING_RUNWARE:0:20}..."
    echo "   POSTGRES: ${EXISTING_POSTGRES_PASSWORD:0:15}..."
else
    echo "⚠️ Keine .env-Datei gefunden - wird neu erstellt"
    EXISTING_DEEPSEEK="your_deepseek_api_key_here"
    EXISTING_RUNWARE="your_runware_api_key_here" 
    EXISTING_POSTGRES_PASSWORD="walter_braun_secure_2024_$(date +%s)"
fi

# Go to project directory
cd /opt/walter-braun-umzuege

# Update .env with domain and preserve API keys
echo "📝 Aktualisiere .env-Datei mit Domain und bestehenden API-Keys..."
cat > .env << EOF
# Database Configuration
POSTGRES_PASSWORD=${EXISTING_POSTGRES_PASSWORD}

# API Keys (bestehende Keys beibehalten)
DEEPSEEK_API_KEY=${EXISTING_DEEPSEEK}
RUNWARE_API_KEY=${EXISTING_RUNWARE}

# Domain Configuration
DOMAIN=$DOMAIN
VPS_IP=$VPS_IP
EOF

echo "✅ .env-Datei aktualisiert mit:"
echo "   - Bestehende API-Keys beibehalten"
echo "   - Domain: $DOMAIN hinzugefügt"
echo "   - VPS-IP: $VPS_IP hinzugefügt"

# Now run the fixed domain setup
echo ""
echo "🚀 Starte Domain & SSL Setup mit bestehenden API-Keys..."
echo "======================================================="

# Check if script exists
if [ -f "./vps-domain-ssl-setup-fixed.sh" ]; then
    # Modify the fixed script to not overwrite .env
    cp ./vps-domain-ssl-setup-fixed.sh ./temp-domain-setup.sh
    
    # Remove the .env creation part from temp script
    sed -i '/# Create environment file if needed/,/^fi$/d' ./temp-domain-setup.sh
    
    # Run the modified script
    chmod +x ./temp-domain-setup.sh
    ./temp-domain-setup.sh
    
    # Cleanup
    rm -f ./temp-domain-setup.sh
else
    echo "❌ vps-domain-ssl-setup-fixed.sh nicht gefunden!"
    echo "Bitte zuerst das Domain-Setup-Skript herunterladen."
    exit 1
fi

echo ""
echo "🎯 Setup abgeschlossen mit bestehenden API-Keys!"
echo "==============================================="
echo "✅ Ihre API-Keys wurden beibehalten"
echo "✅ Domain $DOMAIN ist konfiguriert" 
echo "✅ SSL-Zertifikat wurde angefordert"
echo ""
echo "🔍 Testen Sie: https://$DOMAIN/health"