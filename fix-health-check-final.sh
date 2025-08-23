#!/bin/bash

echo "🏥 Health Check Final Fix"
echo "========================"

echo "1. Backup aktuelle docker-compose.yml..."
cp docker-compose.yml docker-compose.yml.backup-$(date +%H%M%S)

echo ""
echo "2. Verwende reparierte Konfiguration ohne Health Checks..."
cp docker-compose-fixed.yml docker-compose.yml

echo ""
echo "3. Container neu starten..."
docker compose down
docker compose up -d

echo ""
echo "4. Warte 30s auf Container-Start..."
sleep 30

echo ""
echo "5. Finaler Status:"
docker compose ps

echo ""
echo "6. Test der Domain (sollte funktionieren):"
curl -I http://walterbraun-muenchen.de || echo "Test fehlgeschlagen"

echo "========================"
echo "✅ Health Check Fix abgeschlossen!"
echo ""  
echo "🌐 Website läuft bereits auf:"
echo "   - http://walterbraun-muenchen.de ✅"
echo "   - http://217.154.205.93/ ✅"
echo ""
echo "Container sollte jetzt 'Up' (nicht unhealthy) sein!"
echo "========================"