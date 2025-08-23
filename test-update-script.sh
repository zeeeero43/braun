#!/bin/bash

echo "🧪 Test Git Safe Update Script"
echo "=============================="

echo "1. Aktueller Zustand:"
echo "SSL-Konfiguration:"
if [ -f "nginx-ssl.conf" ] && [ -d "ssl" ]; then
    echo "✅ SSL aktiv (HTTPS)"
else
    echo "ℹ️ HTTP-only"
fi

echo ""
echo "Container Status:"
docker compose ps

echo ""
echo "2. Simuliere Update-Prozess..."
echo "Teste Backup-Erstellung..."
BACKUP_TIME=$(date +%Y%m%d-%H%M%S)-test
mkdir -p backups/backup-$BACKUP_TIME
cp docker-compose.yml backups/backup-$BACKUP_TIME/ 2>/dev/null
cp -r ssl/ backups/backup-$BACKUP_TIME/ 2>/dev/null || echo "Keine SSL-Dateien"
echo "✅ Test-Backup erstellt: backups/backup-$BACKUP_TIME/"

echo ""
echo "3. Git-Status:"
git status --porcelain | head -5

echo ""
echo "4. Test Website-Erreichbarkeit:"
curl -s -o /dev/null -w "HTTP %{http_code} - Zeit: %{time_total}s" http://walterbraun-muenchen.de
echo ""
curl -s -o /dev/null -w "HTTPS %{http_code} - Zeit: %{time_total}s" https://walterbraun-muenchen.de 2>/dev/null || echo "HTTPS nicht verfügbar"

echo ""
echo "=============================="
echo "✅ Update-Script sollte sicher sein"
echo "Führe aus: ./git-safe-update.sh"
echo "=============================="