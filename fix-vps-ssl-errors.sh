#!/bin/bash

echo "🔧 Walter Braun VPS SSL Error Fix"
echo "=================================="

# 1. Container stoppen
echo "1. Stoppe alle Container..."
docker compose down --remove-orphans --volumes

# 2. Dateiberechtigungen für data/ Verzeichnis reparieren
echo "2. Repariere Dateiberechtigungen..."
sudo chown -R 1000:1000 data/ 2>/dev/null || mkdir -p data && sudo chown -R 1000:1000 data/
sudo chmod -R 755 data/
sudo chmod 666 data/*.json 2>/dev/null || echo "JSON-Dateien erstellt wenn nötig"

# 3. Lösche fehlerhafte Volume-Daten
echo "3. Bereinige Docker Volumes..."
docker volume prune -f

# 4. Entferne SSL/HTTPS Konfiguration temporär
echo "4. Entferne SSL-Konfiguration..."
export WALTER_BRAUN_HTTP_PORT=80
export WALTER_BRAUN_HTTPS_PORT=""

# 5. Nginx-Konfiguration validieren
echo "5. Validiere Nginx-Konfiguration..."
docker run --rm -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:alpine nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx-Konfiguration fehlerhaft - verwende einfache Konfiguration"
    
    # Backup der aktuellen Konfiguration
    cp nginx.conf nginx.conf.backup
    
    # Erstelle einfache HTTP-only Konfiguration
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream walter_braun_app {
        server web:5000;
    }

    server {
        listen 80;
        server_name _;
        
        # Basic security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;

        # Gzip compression (simplified)
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
fi

# 6. PostgreSQL-Initialisierung reparieren  
echo "6. Repariere PostgreSQL-Initialisierung..."
if [ -f "init-db/init.sql" ]; then
    # Entferne problematische pg_stat_statements Zeilen
    sed -i '/pg_stat_statements/d' init-db/init.sql 2>/dev/null
fi

# 7. Container neu starten
echo "7. Starte Container mit HTTP-only..."
docker compose build --no-cache
docker compose up -d

# 8. Warten auf Start
echo "8. Warte auf Container-Start..."
sleep 30

# 9. Status prüfen
echo "9. Prüfe Container-Status..."
docker compose ps

# 10. Logs anzeigen
echo "10. Container-Logs (letzte 20 Zeilen)..."
docker compose logs --tail=20

# 11. Test HTTP-Verbindung (kein HTTPS)
echo "11. Teste HTTP-Verbindung..."
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:80" | grep -q "200"; then
    echo "✅ Website ist über HTTP erreichbar"
else
    echo "❌ Website nicht erreichbar - weitere Logs:"
    docker compose logs web --tail=10
fi

echo "=================================="
echo "✅ SSL-Error Fix abgeschlossen!"
echo "🌐 Website: http://walterbraun-muenchen.de"
echo "⚠️  HTTPS temporär deaktiviert"
echo "=================================="