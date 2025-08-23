#!/bin/bash

echo "🔄 Walter Braun ULTIMATE Git Update (Auto-SSL-Restore)"
echo "======================================================"

# Backup timestamp
BACKUP_TIME=$(date +%Y%m%d-%H%M%S)

# Check if we have SSL certificates
HAS_CERTS=false
SSL_NEEDS_RESTORE=false

if [ -d "/etc/letsencrypt/live/walterbraun-muenchen.de" ]; then
    HAS_CERTS=true
    echo "✅ SSL-Zertifikate vorhanden"
else
    echo "⚠️ Keine SSL-Zertifikate - werden nach Update erstellt"
fi

# Check current SSL configuration
if [ -f "nginx-ssl.conf" ] && [ -d "ssl" ]; then
    echo "✅ SSL-Konfiguration aktiv"
else
    if [ "$HAS_CERTS" = true ]; then
        SSL_NEEDS_RESTORE=true
        echo "⚠️ SSL-Zertifikate vorhanden aber nicht konfiguriert"
    else
        echo "ℹ️ HTTP-only Modus"
    fi
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

echo ""
echo "8. Dependencies aktualisieren..."
npm install --production

echo ""
echo "9. SSL automatisch wiederherstellen (falls nötig)..."
if [ "$SSL_NEEDS_RESTORE" = true ] || [ "$HAS_CERTS" = true ]; then
    echo "🔒 SSL-Wiederherstellung wird automatisch ausgeführt..."
    
    # SSL-Verzeichnis erstellen
    sudo mkdir -p ./ssl
    sudo cp /etc/letsencrypt/live/walterbraun-muenchen.de/fullchain.pem ./ssl/ 2>/dev/null
    sudo cp /etc/letsencrypt/live/walterbraun-muenchen.de/privkey.pem ./ssl/ 2>/dev/null
    sudo chown -R 1000:1000 ./ssl
    sudo chmod 644 ./ssl/*.pem 2>/dev/null
    
    # Nginx SSL config erstellen
    cat > nginx-ssl.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream walter_braun_app {
        server web:5000;
    }

    # HTTP -> HTTPS Redirect
    server {
        listen 80;
        server_name walterbraun-muenchen.de www.walterbraun-muenchen.de;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name walterbraun-muenchen.de www.walterbraun-muenchen.de;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;

        add_header Strict-Transport-Security "max-age=31536000" always;

        gzip on;
        gzip_vary on;
        gzip_min_length 10240;
        gzip_proxied any;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

        client_max_body_size 50M;

        location / {
            proxy_pass http://walter_braun_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
EOF

    # Docker compose mit SSL
    cat > docker-compose.yml << 'EOF'
services:
  postgres:
    image: postgres:15-alpine
    container_name: walter_braun_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: walter_braun_umzuege
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-secure_password_2024}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - walter_braun_network

  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: walter_braun_web
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 5000
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD:-secure_password_2024}@postgres:5432/walter_braun_umzuege
      PGHOST: postgres
      PGPORT: 5432
      PGUSER: postgres
      PGPASSWORD: ${POSTGRES_PASSWORD:-secure_password_2024}
      PGDATABASE: walter_braun_umzuege
      DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY}
      RUNWARE_API_KEY: ${RUNWARE_API_KEY}
    depends_on:
      - postgres
    networks:
      - walter_braun_network
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
      - ./data:/app/data

  nginx:
    image: nginx:alpine
    container_name: walter_braun_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
    networks:
      - walter_braun_network

volumes:
  postgres_data:
    driver: local

networks:
  walter_braun_network:
    driver: bridge
EOF
    
    echo "✅ SSL-Konfiguration automatisch erstellt"
fi

echo ""
echo "10. Container neu bauen..."
docker compose build --no-cache

echo ""
echo "11. Container starten..."
docker compose up -d

echo ""
echo "12. Warte auf Container-Start (60s)..."
sleep 60

echo ""
echo "13. Container Status:"
docker compose ps

echo ""
echo "14. SSL-Zertifikate neu erstellen (falls nicht vorhanden)..."
if [ ! -d "/etc/letsencrypt/live/walterbraun-muenchen.de" ]; then
    echo "🔒 Erstelle SSL-Zertifikate..."
    docker compose down
    sudo systemctl stop apache2 nginx 2>/dev/null
    sudo fuser -k 80/tcp 443/tcp 2>/dev/null
    
    sudo certbot certonly --standalone \
      --preferred-challenges http \
      --email info@walterbraun-umzuege.de \
      --agree-tos \
      --no-eff-email \
      -d walterbraun-muenchen.de \
      -d www.walterbraun-muenchen.de \
      --force-renewal || echo "SSL-Zertifikat-Erstellung übersprungen"
    
    # SSL für Docker kopieren (falls erfolgreich)
    if [ -d "/etc/letsencrypt/live/walterbraun-muenchen.de" ]; then
        sudo mkdir -p ./ssl
        sudo cp /etc/letsencrypt/live/walterbraun-muenchen.de/fullchain.pem ./ssl/
        sudo cp /etc/letsencrypt/live/walterbraun-muenchen.de/privkey.pem ./ssl/
        sudo chown -R 1000:1000 ./ssl
        sudo chmod 644 ./ssl/*.pem
        echo "✅ SSL-Zertifikate erstellt und konfiguriert"
    fi
    
    # Container wieder starten
    docker compose up -d
    sleep 30
fi

echo ""
echo "15. Website-Tests:"
echo "HTTP-Test:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://walterbraun-muenchen.de 2>/dev/null)
echo "HTTP Status: $HTTP_STATUS"

echo "HTTPS-Test:"
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://walterbraun-muenchen.de 2>/dev/null)
echo "HTTPS Status: $HTTPS_STATUS"

echo "Contact API Test:"
curl -X POST http://walterbraun-muenchen.de/api/contact -H "Content-Type: application/json" -d '{"test":"true"}' 2>/dev/null | head -1 || echo "API test failed"

echo ""
echo "16. Container Logs (wichtige Fehler):"
docker compose logs web --tail=10 | grep -E "(Error|error|ERROR|404|500)" || echo "Keine kritischen Fehler"
docker compose logs nginx --tail=5 2>/dev/null | grep -E "(Error|error|ERROR)" || echo "Nginx OK"

echo ""
echo "======================================================"
echo "✅ ULTIMATE GIT UPDATE ABGESCHLOSSEN!"
echo ""
echo "🌐 Website sollte verfügbar sein unter:"
echo "   • https://walterbraun-muenchen.de"
echo "   • http://walterbraun-muenchen.de (→ HTTPS redirect)"
echo ""
echo "🔧 API Endpoints:"
echo "   • POST /api/contact (Contact Form)"
echo "   • GET /api/blog (Blog Posts)"
echo ""
echo "📝 Bei Problemen:"
echo "   git stash pop                    # Code änderungen rückgängig"
echo "   ./emergency-recovery.sh          # Vollständige Wiederherstellung"
echo "======================================================"