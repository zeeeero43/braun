#!/bin/bash

echo "📋 Walter Braun VPS Log Analyzer"
echo "================================"

echo "1. Container Status:"
docker compose ps

echo ""
echo "2. Web Container Logs (letzte 50 Zeilen):"
echo "----------------------------------------"
docker compose logs web --tail=50

echo ""
echo "3. Nginx Container Logs:"
echo "-----------------------"
docker compose logs nginx --tail=20 2>/dev/null || echo "Nginx Container nicht aktiv"

echo ""
echo "4. Database Container Logs:"
echo "--------------------------"
docker compose logs postgres --tail=20

echo ""
echo "5. Alle Container Logs (letzte 20 Zeilen):"
echo "------------------------------------------"
docker compose logs --tail=20

echo ""
echo "6. System-Ports prüfen:"
echo "-----------------------"
echo "Port 80:"
netstat -tlnp | grep :80 || echo "Port 80 frei"
echo "Port 443:"  
netstat -tlnp | grep :443 || echo "Port 443 frei"
echo "Port 5000:"
netstat -tlnp | grep :5000 || echo "Port 5000 frei"

echo ""
echo "7. Docker System Info:"
echo "---------------------"
docker system df

echo ""
echo "8. Dateiberechtigungen prüfen:"
echo "------------------------------"
ls -la data/ 2>/dev/null || echo "data/ Verzeichnis nicht vorhanden"
ls -la uploads/ 2>/dev/null || echo "uploads/ Verzeichnis nicht vorhanden"

echo ""
echo "9. Nginx Konfiguration testen:"
echo "------------------------------"
docker run --rm -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:alpine nginx -t 2>/dev/null || echo "Nginx-Konfiguration fehlerhaft"

echo ""
echo "10. Curl-Test auf localhost:"
echo "----------------------------"
curl -I http://localhost 2>/dev/null || echo "HTTP-Verbindung fehlgeschlagen"
curl -I https://localhost 2>/dev/null || echo "HTTPS-Verbindung fehlgeschlagen"

echo "================================"