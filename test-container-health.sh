#!/bin/bash

echo "🔍 Container Health Diagnostics"
echo "==============================="

echo "1. Container Status:"
docker compose ps

echo ""
echo "2. Health Check direkt im Web Container:"
docker exec walter_braun_web curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/ || echo "Curl fehlgeschlagen"

echo ""
echo "3. Health Check Endpunkt:"
docker exec walter_braun_web curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health || echo "Health endpoint fehlgeschlagen"

echo ""
echo "4. Prozesse im Web Container:"
docker exec walter_braun_web ps aux

echo ""
echo "5. Ports im Web Container:"
docker exec walter_braun_web netstat -tlnp 2>/dev/null || docker exec walter_braun_web ss -tlnp

echo ""
echo "6. App-Logs der letzten 30 Zeilen:"
docker compose logs web --tail=30

echo ""
echo "7. Teste von außen:"
echo "HTTP localhost:"
curl -I http://localhost 2>/dev/null || echo "❌ HTTP localhost nicht erreichbar"

echo "HTTP 127.0.0.1:"
curl -I http://127.0.0.1 2>/dev/null || echo "❌ HTTP 127.0.0.1 nicht erreichbar"

echo ""
echo "8. Docker Network prüfen:"
docker network ls
docker compose exec web ping -c 2 postgres || echo "Ping zu postgres fehlgeschlagen"

echo "==============================="