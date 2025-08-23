#!/bin/bash

echo "⚡ Schnelle HTTPS-Wiederherstellung"
echo "=================================="

echo "1. Container stoppen für SSL-Zertifikat..."
docker compose down

echo ""
echo "2. System-Webserver stoppen..."
sudo systemctl stop apache2 nginx 2>/dev/null
sudo fuser -k 80/tcp 443/tcp 2>/dev/null

echo ""
echo "3. Certbot SSL-Zertifikat erstellen..."
sudo certbot certonly --standalone \
  --preferred-challenges http \
  --email info@walterbraun-umzuege.de \
  --agree-tos \
  --no-eff-email \
  -d walterbraun-muenchen.de \
  -d www.walterbraun-muenchen.de \
  --force-renewal

if [ $? -ne 0 ]; then
    echo "❌ SSL-Zertifikat Erstellung fehlgeschlagen!"
    echo "Starte Container ohne SSL..."
    docker compose up -d
    echo "Website läuft nur über HTTP: http://walterbraun-muenchen.de"
    exit 1
fi

echo ""
echo "4. SSL-Verzeichnis für Docker erstellen..."
sudo mkdir -p ./ssl
sudo cp /etc/letsencrypt/live/walterbraun-muenchen.de/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/walterbraun-muenchen.de/privkey.pem ./ssl/
sudo chown -R 1000:1000 ./ssl
sudo chmod 644 ./ssl/*.pem

echo ""
echo "5. HTTPS-Konfiguration wiederherstellen..."
# Verwende das restore-https.sh Script für die Konfiguration
./restore-https.sh

echo "=================================="
echo "✅ HTTPS schnell wiederhergestellt!"
echo "🌐 https://walterbraun-muenchen.de"
echo "=================================="