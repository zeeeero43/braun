#!/bin/bash

echo "🚨 EMERGENCY DIAGNOSIS - ERR_CONNECTION_REFUSED"
echo "==============================================="

echo "1. Container Status:"
docker compose ps

echo ""
echo "2. Alle laufenden Container:"
docker ps -a

echo ""
echo "3. Port 80 Status:"
netstat -tlnp | grep :80 || echo "Port 80 frei"
lsof -i :80 2>/dev/null || echo "Keine Prozesse auf Port 80"

echo ""
echo "4. System-Webserver Status:"
systemctl status apache2 2>/dev/null || echo "Apache2 nicht aktiv"
systemctl status nginx 2>/dev/null || echo "Nginx nicht aktiv"

echo ""
echo "5. Docker Service Status:"
systemctl status docker

echo ""
echo "6. Docker Compose Logs (letzte 20 Zeilen):"
docker compose logs --tail=20

echo ""
echo "7. Ping localhost:"
ping -c 2 localhost || echo "Localhost ping fehlgeschlagen"

echo ""
echo "8. Curl Test verschiedene Varianten:"
echo "localhost:"
curl -I http://localhost 2>&1 | head -3
echo "127.0.0.1:"
curl -I http://127.0.0.1 2>&1 | head -3
echo "IP:"
curl -I http://217.154.205.93 2>&1 | head-3

echo "==============================================="