#!/bin/bash

echo "🆘 Walter Braun VPS Complete Recovery"
echo "===================================="

# Backup aktueller Zustand
echo "0. Erstelle Backup der aktuellen Konfiguration..."
mkdir -p backup-$(date +%Y%m%d-%H%M%S)
cp docker-compose.yml backup-*/
cp nginx.conf backup-*/
cp -r data backup-*/ 2>/dev/null || echo "Data-Verzeichnis nicht vorhanden"

# 1. Alles stoppen und bereinigen
echo "1. Vollständige Bereinigung..."
docker compose down --remove-orphans --volumes --rmi local 2>/dev/null
docker system prune -af
docker volume prune -f

# 2. System-Webserver stoppen
echo "2. Stoppe System-Webserver..."
sudo systemctl stop apache2 nginx lighttpd 2>/dev/null
sudo fuser -k 80/tcp 443/tcp 2>/dev/null

# 3. Verzeichnisse und Berechtigungen reparieren  
echo "3. Repariere Verzeichnisse und Berechtigungen..."
sudo mkdir -p data uploads logs ssl
sudo chown -R $USER:$USER data uploads logs ssl
sudo chmod -R 755 data uploads logs ssl

# 4. Erstelle leere Dateien falls nicht vorhanden
touch data/blog_ideas.json data/contacts.json data/blog_posts.json
chmod 666 data/*.json

# 5. Nginx-Konfiguration vereinfachen (HTTP-only)
echo "4. Erstelle einfache Nginx-Konfiguration..."
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream app {
        server web:5000;
    }

    server {
        listen 80;
        server_name _;
        client_max_body_size 50M;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

# 6. Docker Compose vereinfachen
echo "5. Vereinfache Docker Compose (HTTP-only)..."
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
    ports:
      - "5432:5432"
    networks:
      - walter_braun_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d walter_braun_umzuege"]
      interval: 30s
      timeout: 10s
      retries: 3

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
    ports:
      - "80:5000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - walter_braun_network
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
      - ./data:/app/data
    user: "1000:1000"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/"]
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

# 7. Umgebungsvariablen setzen
export POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-secure_password_2024}
echo "Umgebungsvariablen gesetzt"

# 8. Build und Start
echo "6. Baue und starte Container..."
docker compose build --no-cache
docker compose up -d

# 9. Warten
echo "7. Warte auf Container-Start..."
for i in {1..60}; do
    if docker compose ps | grep -q "Up"; then
        echo "Container gestartet nach ${i}s"
        break
    fi
    sleep 1
done

# 10. Status
echo "8. Finale Checks..."
docker compose ps
docker compose logs --tail=10

# 11. Test
echo "9. Teste Verbindung..."
sleep 5
if curl -s -f http://localhost/ > /dev/null; then
    echo "✅ Website erfolgreich erreichbar!"
    echo "🌐 URL: http://walterbraun-muenchen.de"
else
    echo "❌ Website noch nicht erreichbar - weitere Logs:"
    docker compose logs web --tail=20
fi

echo "===================================="
echo "🎉 Recovery abgeschlossen!"
echo "📍 Backup erstellt in: backup-*"
echo "===================================="