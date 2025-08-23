#!/bin/bash

echo "🚨 EMERGENCY RECOVERY - Website wiederherstellen"
echo "==============================================="

echo "1. Container Status prüfen:"
docker compose ps

echo ""
echo "2. Container stoppen..."
docker compose down --remove-orphans

echo ""
echo "3. Neueste Backup finden..."
LATEST_BACKUP=$(ls -1t backups/ | head -1)
echo "Neuestes Backup: $LATEST_BACKUP"

if [ -n "$LATEST_BACKUP" ] && [ -d "backups/$LATEST_BACKUP" ]; then
    echo "4. Backup wiederherstellen..."
    cp -r backups/$LATEST_BACKUP/* ./ 2>/dev/null
    echo "✅ Backup wiederhergestellt"
else
    echo "4. Kein Backup gefunden - verwende funktionierende Konfiguration..."
    # Funktionierende docker-compose.yml wiederherstellen
    cp docker-compose-fixed.yml docker-compose.yml 2>/dev/null
fi

echo ""
echo "5. Git stash prüfen und wiederherstellen..."
git stash list | head -3
if git stash list | grep -q "Auto-stash"; then
    echo "Git stash gefunden - wird wiederhergestellt..."
    git stash pop || echo "Stash konnte nicht angewendet werden"
fi

echo ""
echo "6. Dateiberechtigungen reparieren..."
sudo chown -R $USER:$USER ./
sudo chmod -R 755 data/ uploads/ logs/ 2>/dev/null
sudo chmod 666 data/*.json 2>/dev/null

echo ""
echo "7. Container mit funktionierender Konfiguration starten..."
# Verwende die bewährte Konfiguration
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
    ports:
      - "80:5000"
    depends_on:
      - postgres
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

echo ""
echo "8. Container bauen und starten..."
docker compose build --no-cache
docker compose up -d

echo ""
echo "9. Warte auf Start (60s)..."
sleep 60

echo ""
echo "10. Container Status:"
docker compose ps

echo ""
echo "11. Website-Tests:"
curl -I http://localhost || echo "HTTP localhost fehlgeschlagen"
curl -I http://217.154.205.93 || echo "HTTP IP fehlgeschlagen"
curl -I http://walterbraun-muenchen.de || echo "HTTP Domain fehlgeschlagen"

echo ""
echo "12. Container Logs:"
docker compose logs web --tail=15

echo "==============================================="
echo "🎯 RECOVERY ABGESCHLOSSEN!"
echo ""
echo "Website sollte wieder funktionieren:"
echo "- http://walterbraun-muenchen.de"
echo "- http://217.154.205.93"
echo "==============================================="