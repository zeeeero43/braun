#!/bin/bash

echo "🔧 SSL Auto-Renewal Cron-Job Setup"
echo "==================================="

PROJECT_DIR="/opt/walter-braun-umzuege"
SCRIPT_PATH="$PROJECT_DIR/ssl-auto-renew.sh"

if [ "$EUID" -ne 0 ]; then
    echo "❌ Bitte als Root ausführen: sudo ./setup-ssl-cron.sh"
    exit 1
fi

echo "1. Skript ausführbar machen..."
chmod +x "$SCRIPT_PATH"
echo "✅ Skript ist ausführbar"

echo ""
echo "2. Log-Datei vorbereiten..."
touch /var/log/ssl-renewal.log
chmod 644 /var/log/ssl-renewal.log
echo "✅ Log-Datei erstellt: /var/log/ssl-renewal.log"

echo ""
echo "3. Cron-Job installieren..."

CRON_JOB="0 3 1 * * $SCRIPT_PATH >> /var/log/ssl-renewal.log 2>&1"

(crontab -l 2>/dev/null | grep -v "ssl-auto-renew.sh"; echo "$CRON_JOB") | crontab -

echo "✅ Cron-Job installiert!"

echo ""
echo "4. Aktueller Cron-Job:"
crontab -l | grep ssl-auto-renew

echo ""
echo "==================================="
echo "✅ SETUP ABGESCHLOSSEN!"
echo ""
echo "📅 SSL wird automatisch erneuert:"
echo "   - Am 1. jeden Monats"
echo "   - Um 03:00 Uhr nachts"
echo ""
echo "📄 Logs findest du hier:"
echo "   tail -f /var/log/ssl-renewal.log"
echo ""
echo "🔧 Manueller Test:"
echo "   sudo $SCRIPT_PATH"
echo ""
echo "❌ Cron-Job entfernen:"
echo "   crontab -e  (dann Zeile löschen)"
echo "==================================="
