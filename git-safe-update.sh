#!/bin/bash

echo "🔄 Walter Braun Git Safe Update (SSL-Aware Version)"
echo "=================================================="

# Backup timestamp
BACKUP_TIME=$(date +%Y%m%d-%H%M%S)

# Detect current SSL configuration
HAS_SSL=false
HAS_NGINX=false
if [ -f "nginx-ssl.conf" ] && [ -d "ssl" ]; then
    HAS_SSL=true
    HAS_NGINX=true
    echo "✅ SSL-Konfiguration erkannt (HTTPS aktiv)"
elif docker compose ps | grep -q nginx; then
    HAS_NGINX=true
    echo "✅ Nginx-Konfiguration erkannt"
else
    echo "ℹ️ HTTP-only Konfiguration erkannt"
fi

echo ""
echo "1. Vollständiges Backup erstellen..."
mkdir -p backups/backup-$BACKUP_TIME

# Backup all important files
cp -r data/ backups/backup-$BACKUP_TIME/ 2>/dev/null
cp docker-compose.yml backups/backup-$BACKUP_TIME/
cp .env backups/backup-$BACKUP_TIME/ 2>/dev/null

# SSL-specific backups
if [ "$HAS_SSL" = true ]; then
    cp nginx-ssl.conf backups/backup-$BACKUP_TIME/ 2>/dev/null
    cp -r ssl/ backups/backup-$BACKUP_TIME/ 2>/dev/null
    echo "✅ SSL-Zertifikate und -Konfiguration gesichert"
fi

if [ "$HAS_NGINX" = true ]; then
    cp nginx.conf backups/backup-$BACKUP_TIME/ 2>/dev/null
    echo "✅ Nginx-Konfiguration gesichert"
fi

echo "✅ Backup erstellt in: backups/backup-$BACKUP_TIME/"

echo ""
echo "2. Container sicher stoppen..."
docker compose down

echo ""
echo "3. Git-Status prüfen..."
git status

echo ""
echo "4. Lokale Änderungen stashen..."
git add .
git stash push -m "Auto-stash before update $BACKUP_TIME (SSL: $HAS_SSL, Nginx: $HAS_NGINX)"

echo ""
echo "5. Remote-Änderungen holen..."
git fetch origin main

echo ""
echo "6. Git pull ausführen..."
if git pull origin main; then
    echo "✅ Git pull erfolgreich"
else
    echo "❌ Git pull fehlgeschlagen - Rollback wird ausgeführt..."
    git stash pop
    # Restore configurations
    cp -r backups/backup-$BACKUP_TIME/* ./
    echo "❌ Backup wiederhergestellt. Manuelle Konfliktlösung erforderlich."
    exit 1
fi

echo ""
echo "7. Konfigurationen wiederherstellen..."

# Restore SSL configuration if it was present
if [ "$HAS_SSL" = true ]; then
    if [ ! -f "nginx-ssl.conf" ] || [ ! -d "ssl" ]; then
        echo "⚠️ SSL-Konfiguration fehlt nach Git pull - wird wiederhergestellt..."
        cp backups/backup-$BACKUP_TIME/nginx-ssl.conf ./ 2>/dev/null
        cp -r backups/backup-$BACKUP_TIME/ssl/ ./ 2>/dev/null
        echo "✅ SSL-Konfiguration wiederhergestellt"
    fi
fi

# Restore nginx configuration if needed
if [ "$HAS_NGINX" = true ] && [ ! -f "nginx.conf" ]; then
    echo "⚠️ Nginx-Konfiguration fehlt - wird wiederhergestellt..."
    cp backups/backup-$BACKUP_TIME/nginx.conf ./ 2>/dev/null
fi

# Ensure docker-compose.yml is compatible with current setup
if [ "$HAS_SSL" = true ]; then
    if ! grep -q "nginx:" docker-compose.yml; then
        echo "⚠️ Docker-compose.yml ist nicht SSL-kompatibel - wird korrigiert..."
        cp backups/backup-$BACKUP_TIME/docker-compose.yml ./
        echo "✅ SSL-kompatible docker-compose.yml wiederhergestellt"
    fi
fi

echo ""
echo "8. Dependencies aktualisieren..."
npm install --production

echo ""
echo "9. Container neu bauen..."
docker compose build --no-cache

echo ""
echo "10. Container starten..."
docker compose up -d

echo ""
echo "11. Warte auf Container-Start (60s)..."
sleep 60

echo ""
echo "12. Container Status:"
docker compose ps

echo ""
echo "13. Website-Tests:"
echo "HTTP-Test:"
curl -I http://walterbraun-muenchen.de || echo "HTTP-Test fehlgeschlagen"

if [ "$HAS_SSL" = true ]; then
    echo "HTTPS-Test:"
    curl -I https://walterbraun-muenchen.de || echo "HTTPS-Test fehlgeschlagen"
    echo "HTTP->HTTPS Redirect-Test:"
    curl -I http://walterbraun-muenchen.de | head -3
fi

echo ""
echo "14. Container Logs (letzte 10 Zeilen):"
docker compose logs web --tail=10
if [ "$HAS_NGINX" = true ]; then
    docker compose logs nginx --tail=5
fi

echo ""
echo "15. Stashed Changes:"
git stash list | head -3

echo "=================================================="
echo "✅ SSL-AWARE GIT UPDATE ABGESCHLOSSEN!"
echo ""
echo "📊 Konfiguration:"
echo "   SSL: $HAS_SSL"
echo "   Nginx: $HAS_NGINX"
echo ""
echo "🌐 Website Status:"
if [ "$HAS_SSL" = true ]; then
    echo "   HTTPS: https://walterbraun-muenchen.de ✅"
    echo "   HTTP->HTTPS Redirect aktiv ✅"
else
    echo "   HTTP: http://walterbraun-muenchen.de ✅"
fi
echo ""
echo "📝 Rollback-Optionen:"
echo "   git stash pop                                    # Code-Changes"
echo "   cp -r backups/backup-$BACKUP_TIME/* ./         # Vollständiges Backup"
echo "   ./restore-https.sh                              # SSL wiederherstellen"
echo "=================================================="