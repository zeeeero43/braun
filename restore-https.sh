#!/bin/bash

echo "🔒 HTTPS SSL Konfiguration wiederherstellen"
echo "=========================================="

echo "1. SSL-Zertifikate prüfen..."
if [ -d "/etc/letsencrypt/live/walterbraun-muenchen.de" ]; then
    echo "✅ SSL-Zertifikate gefunden"
    sudo ls -la /etc/letsencrypt/live/walterbraun-muenchen.de/
else
    echo "❌ Keine SSL-Zertifikate gefunden!"
    echo "Zuerst SSL-Setup ausführen: ./setup-ssl-https.sh"
    exit 1
fi

echo ""
echo "2. Container stoppen..."
docker compose down

echo ""
echo "3. SSL-Verzeichnis für Docker erstellen..."
sudo mkdir -p ./ssl
sudo cp /etc/letsencrypt/live/walterbraun-muenchen.de/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/walterbraun-muenchen.de/privkey.pem ./ssl/
sudo chown -R 1000:1000 ./ssl
sudo chmod 644 ./ssl/*.pem

echo ""
echo "4. Nginx SSL Konfiguration erstellen..."
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

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 10240;
        gzip_proxied any;
        gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

        # Client body size limit
        client_max_body_size 50M;

        # Proxy all requests to web app
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

echo ""
echo "5. Docker Compose mit SSL wiederherstellen..."
cat > docker-compose.yml << 'EOF'
services:
  # PostgreSQL Database
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

  # Main Web Application
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

  # Nginx SSL Reverse Proxy
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

echo ""
echo "6. Container mit SSL starten..."
docker compose up -d --build

echo ""
echo "7. Warte auf Container-Start (45s)..."
sleep 45

echo ""
echo "8. Container Status:"
docker compose ps

echo ""
echo "9. HTTPS-Tests:"
echo "HTTP -> HTTPS Redirect:"
curl -I http://walterbraun-muenchen.de/ | head -3

echo ""
echo "HTTPS direkt:"
curl -I https://walterbraun-muenchen.de/ || echo "HTTPS Test fehlgeschlagen"

echo ""
echo "10. Container Logs:"
docker compose logs nginx --tail=10
docker compose logs web --tail=10

echo "=========================================="
echo "✅ HTTPS WIEDERHERGESTELLT!"
echo ""
echo "🌐 Website läuft wieder unter:"
echo "   - https://walterbraun-muenchen.de ✅"
echo "   - https://www.walterbraun-muenchen.de ✅" 
echo "   - http redirected zu https ✅"
echo "=========================================="