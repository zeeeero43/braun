#!/bin/bash

echo "🔧 Einfacher SSL Fix"
echo "==================="

# Überprüfe ob Zertifikate existieren
if [ ! -d "/etc/letsencrypt/live/walterbraun-muenchen.de" ]; then
    echo "SSL-Zertifikate müssen neu erstellt werden."
    echo "Führe aus: sudo ./quick-ssl-restore.sh"
    echo ""
    echo "ALTERNATIVE: Website läuft über HTTP"
    echo "- http://walterbraun-muenchen.de (funktioniert)"
    echo "- HTTPS benötigt neue Zertifikate"
    exit 0
fi

echo "Zertifikate gefunden - aktiviere HTTPS..."
./restore-https.sh