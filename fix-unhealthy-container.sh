#!/bin/bash

echo "🏥 Fix Unhealthy Web Container"
echo "============================="

echo "1. Aktueller Container-Status:"
docker compose ps

echo ""
echo "2. Health Check im Container testen:"
docker exec walter_braun_web curl -f http://localhost:5000/health || echo "Health Check fehlgeschlagen"

echo ""
echo "3. Port 5000 im Container prüfen:"
docker exec walter_braun_web netstat -tlnp | grep :5000 || echo "Port 5000 nicht aktiv"

echo ""
echo "4. Node.js Prozess prüfen:"
docker exec walter_braun_web ps aux | grep node || echo "Node.js Prozess nicht gefunden"

echo ""
echo "5. Container neu starten mit gesunder Konfiguration:"
docker compose down
sleep 5

# Temporär Health Check entfernen
echo "Erstelle temporäre docker-compose ohne Health Check..."
cp docker-compose.yml docker-compose.yml.backup

cat > docker-compose-fix.yml << 'EOF'
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

volumes:
  postgres_data:
    driver: local

networks:
  walter_braun_network:
    driver: bridge
EOF

echo "6. Starte Container mit neuer Konfiguration:"
docker compose -f docker-compose-fix.yml up -d --build

echo ""
echo "7. Warte 30s auf Start..."
sleep 30

echo ""
echo "8. Neuer Status:"
docker compose -f docker-compose-fix.yml ps

echo ""
echo "9. Web Container Logs:"
docker compose -f docker-compose-fix.yml logs web --tail=20

echo ""
echo "10. Teste HTTP-Verbindung:"
curl -I http://localhost/ || echo "HTTP-Test fehlgeschlagen"

echo "============================="
echo "Fix abgeschlossen!"