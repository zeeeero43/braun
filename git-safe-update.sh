#!/bin/bash

echo "🔄 Walter Braun Git Safe Update"
echo "==============================="

# Backup timestamp
BACKUP_TIME=$(date +%Y%m%d-%H%M%S)

echo "1. Backup aktueller Zustand..."
mkdir -p backups/backup-$BACKUP_TIME
cp -r data/ backups/backup-$BACKUP_TIME/ 2>/dev/null
cp docker-compose.yml backups/backup-$BACKUP_TIME/
cp .env backups/backup-$BACKUP_TIME/ 2>/dev/null
echo "✅ Backup erstellt in: backups/backup-$BACKUP_TIME/"

echo ""
echo "2. Container stoppen..."
docker compose down

echo ""
echo "3. Git-Status prüfen..."
git status

echo ""
echo "4. Lokale Änderungen stashen..."
git add .
git stash push -m "Auto-stash before update $BACKUP_TIME"

echo ""
echo "5. Remote-Änderungen holen..."
git fetch origin main

echo ""
echo "6. Git pull ausführen..."
if git pull origin main; then
    echo "✅ Git pull erfolgreich"
else
    echo "❌ Git pull fehlgeschlagen - stelle Backup wieder her"
    git stash pop
    cp -r backups/backup-$BACKUP_TIME/* ./
    echo "Backup wiederhergestellt. Manuelle Konfliktlösung erforderlich."
    exit 1
fi

echo ""
echo "7. Dependencies aktualisieren..."
npm install

echo ""
echo "8. Container neu bauen (ohne Cache)..."
docker compose build --no-cache

echo ""
echo "9. Container starten..."
docker compose up -d

echo ""
echo "10. Warte auf Container-Start (45s)..."
sleep 45

echo ""
echo "11. Container Status:"
docker compose ps

echo ""
echo "12. Test Website:"
curl -I http://localhost || curl -I http://217.154.205.93 || echo "Website-Test fehlgeschlagen"

echo ""
echo "13. Test HTTPS (falls konfiguriert):"
curl -I https://walterbraun-muenchen.de || echo "HTTPS nicht verfügbar"

echo ""
echo "14. Container Logs (letzte 10 Zeilen):"
docker compose logs web --tail=10

echo ""
echo "15. Stashed Changes verfügbar:"
git stash list | head -3

echo "==============================="
echo "✅ Git Safe Update abgeschlossen!"
echo ""
echo "📝 Falls Probleme auftreten:"
echo "   git stash pop          # Lokale Änderungen wiederherstellen"
echo "   cp -r backups/backup-$BACKUP_TIME/* ./  # Backup wiederherstellen"
echo ""
echo "🌐 Website Status:"
echo "   HTTP: http://walterbraun-muenchen.de"
echo "   HTTPS: https://walterbraun-muenchen.de"
echo "==============================="