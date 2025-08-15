#!/bin/bash

# Walter Braun Umzüge - Domain & SSL Setup für walterbraun-muenchen.de
# ==================================================================

DOMAIN="walterbraun-muenchen.de"
EMAIL="info@walterbraun-muenchen.de"
VPS_IP=$(hostname -I | awk '{print $1}')

echo "🌐 Walter Braun Domain & SSL Setup"
echo "=================================="
echo "🔗 Domain: $DOMAIN"
echo "📧 Email: $EMAIL"
echo "🖥️ VPS IP: $VPS_IP"
echo ""

# Function to print status messages
print_status() {
    echo "✅ $1"
}

print_warning() {
    echo "⚠️ $1"
}

print_error() {
    echo "❌ $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Bitte als root ausführen: sudo $0"
    exit 1
fi

# Update system
print_warning "System wird aktualisiert..."
apt update && apt upgrade -y

# Install required packages
print_warning "Installiere erforderliche Pakete..."
apt install -y certbot python3-certbot-nginx nginx curl wget

# Stop existing containers
print_warning "Stoppe bestehende Container..."
cd /opt/walter-braun-umzuege
docker compose down

# Backup existing nginx config
print_warning "Sichere bestehende Nginx-Konfiguration..."
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup 2>/dev/null || true

# Create nginx configuration for the domain
print_warning "Erstelle Nginx-Konfiguration für $DOMAIN..."
cat > /etc/nginx/sites-available/$DOMAIN << EOF
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Allow Certbot challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all other HTTP to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration (will be updated by Certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
    
    # Static assets with long cache
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        proxy_pass http://localhost:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
print_warning "Aktiviere Website-Konfiguration..."
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
print_warning "Teste Nginx-Konfiguration..."
if nginx -t; then
    print_status "Nginx-Konfiguration ist gültig"
else
    print_error "Nginx-Konfiguration fehlerhaft!"
    exit 1
fi

# Start nginx
print_warning "Starte Nginx..."
systemctl enable nginx
systemctl restart nginx

# Wait for nginx to be ready
sleep 3

# Create webroot for certbot
mkdir -p /var/www/html

# Obtain SSL certificate
print_warning "Fordere SSL-Zertifikat für $DOMAIN an..."
certbot certonly --webroot \
    -w /var/www/html \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --non-interactive \
    --verbose

if [ $? -eq 0 ]; then
    print_status "SSL-Zertifikat erfolgreich erhalten!"
    
    # Update nginx config with SSL
    print_warning "Aktualisiere Nginx mit SSL-Konfiguration..."
    systemctl reload nginx
    
    # Setup auto-renewal
    print_warning "Richte automatische Zertifikatserneuerung ein..."
    systemctl enable certbot.timer
    systemctl start certbot.timer
    
    print_status "Automatische Erneuerung aktiviert"
else
    print_error "SSL-Zertifikat konnte nicht erhalten werden!"
    print_warning "Überprüfe Domain-DNS-Einstellungen:"
    print_warning "A-Record: $DOMAIN -> $VPS_IP"
    print_warning "A-Record: www.$DOMAIN -> $VPS_IP"
    exit 1
fi

# Update docker-compose for production
print_warning "Aktualisiere Docker-Konfiguration..."
cd /opt/walter-braun-umzuege

# Update docker-compose.yml to remove conflicting ports
cat > docker-compose.production.yml << EOF
services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: walter_braun_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: walter_braun_umzuege
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-secure_password_2024}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db:/docker-entrypoint-initdb.d
    ports:
      - "127.0.0.1:5432:5432"
    networks:
      - walter_braun_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d walter_braun_umzuege"]
      interval: 30s
      timeout: 10s
      retries: 3

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
      DOMAIN: $DOMAIN
      DATABASE_URL: postgresql://postgres:\${POSTGRES_PASSWORD:-secure_password_2024}@postgres:5432/walter_braun_umzuege
      PGHOST: postgres
      PGPORT: 5432
      PGUSER: postgres
      PGPASSWORD: \${POSTGRES_PASSWORD:-secure_password_2024}
      PGDATABASE: walter_braun_umzuege
      DEEPSEEK_API_KEY: \${DEEPSEEK_API_KEY}
      RUNWARE_API_KEY: \${RUNWARE_API_KEY}
    ports:
      - "127.0.0.1:5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - walter_braun_network
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
      - ./data:/app/data
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local

networks:
  walter_braun_network:
    driver: bridge
EOF

# Create production environment file
if [ ! -f .env ]; then
    print_warning "Erstelle .env-Datei..."
    cat > .env << EOF
# Database Configuration
POSTGRES_PASSWORD=walter_braun_secure_2024_$(date +%s)

# API Keys (bitte ergänzen)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
RUNWARE_API_KEY=your_runware_api_key_here

# Domain Configuration
DOMAIN=$DOMAIN
EOF
    print_warning "⚠️ Bitte API-Keys in .env-Datei ergänzen!"
fi

# Set up data directories with correct permissions
print_warning "Richte Datenverzeichnisse ein..."
mkdir -p ./data ./uploads ./logs
chmod 755 ./data ./uploads ./logs
chown -R 1000:1000 ./data ./uploads ./logs

# Start containers with production config
print_warning "Starte Container mit Produktionskonfiguration..."
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml build --no-cache
docker compose -f docker-compose.production.yml up -d

# Wait for containers to start
print_warning "Warte auf Container-Start..."
sleep 15

# Final checks
print_warning "Führe finale Überprüfungen durch..."

# Check if containers are running
if docker compose -f docker-compose.production.yml ps | grep -q "Up"; then
    print_status "Container laufen erfolgreich"
else
    print_error "Container-Problem erkannt"
    docker compose -f docker-compose.production.yml logs --tail=20
fi

# Check if website responds
if curl -s http://localhost:5000/health > /dev/null; then
    print_status "Website antwortet lokal"
else
    print_error "Website antwortet nicht lokal"
fi

# Check SSL certificate
if curl -s https://$DOMAIN/health > /dev/null; then
    print_status "SSL-Website antwortet über Domain"
else
    print_warning "SSL-Website noch nicht erreichbar (DNS-Propagation?)"
fi

# Setup monitoring and maintenance scripts
print_warning "Erstelle Wartungsskripte..."

# SSL renewal script
cat > /opt/walter-braun-umzuege/ssl-renew.sh << 'EOF'
#!/bin/bash
echo "🔄 Erneuere SSL-Zertifikat..."
certbot renew --quiet
systemctl reload nginx
echo "✅ SSL-Erneuerung abgeschlossen"
EOF
chmod +x /opt/walter-braun-umzuege/ssl-renew.sh

# Status check script
cat > /opt/walter-braun-umzuege/status-check.sh << 'EOF'
#!/bin/bash
echo "📊 Walter Braun System Status"
echo "============================="
echo "🐳 Container:"
docker compose -f docker-compose.production.yml ps
echo ""
echo "🌐 Nginx:"
systemctl status nginx --no-pager -l
echo ""
echo "🔒 SSL-Zertifikat:"
certbot certificates
echo ""
echo "💾 Speicher:"
df -h /
echo ""
echo "🔍 Website-Test:"
curl -s -o /dev/null -w "HTTP: %{http_code} | Zeit: %{time_total}s\n" https://walterbraun-muenchen.de/health
EOF
chmod +x /opt/walter-braun-umzuege/status-check.sh

# Create systemd service for auto-startup
cat > /etc/systemd/system/walter-braun.service << EOF
[Unit]
Description=Walter Braun Umzüge Website
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/walter-braun-umzuege
ExecStart=/usr/bin/docker compose -f docker-compose.production.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.production.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl enable walter-braun.service

print_status "=================="
print_status "🎯 Setup Complete!"
print_status "=================="
echo ""
echo "🌐 Website: https://$DOMAIN"
echo "🔒 SSL: Let's Encrypt (auto-renewal aktiviert)"
echo "📱 Status: ./status-check.sh"
echo "🔄 SSL erneuern: ./ssl-renew.sh"
echo ""
print_warning "WICHTIGE NÄCHSTE SCHRITTE:"
echo "1. DNS konfigurieren:"
echo "   A-Record: $DOMAIN -> $VPS_IP"
echo "   A-Record: www.$DOMAIN -> $VPS_IP"
echo ""
echo "2. API-Keys in .env ergänzen:"
echo "   - DEEPSEEK_API_KEY"
echo "   - RUNWARE_API_KEY"
echo ""
echo "3. System neu starten:"
echo "   docker compose -f docker-compose.production.yml restart"
echo ""
print_status "Website ist bereit für https://$DOMAIN!"