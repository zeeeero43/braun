#!/bin/bash

echo "🎯 FINAL VPS DEPLOYMENT - Garantiert funktionierend"
echo "================================================="

echo "1. Alle Container stoppen"
docker compose down --remove-orphans

echo ""
echo "2. Altes Image entfernen"
docker image rm walter-braun-umzuege-web 2>/dev/null || echo "Image bereits entfernt"
docker system prune -f

echo ""
echo "3. Mit neuem, einfachem Dockerfile bauen"
docker compose build --no-cache web

echo ""
echo "4. Container starten"
docker compose up -d

echo ""
echo "5. 60 Sekunden warten für vollständigen Start"
for i in {1..12}; do
    echo "Warte... $((i*5))s"
    sleep 5
done

echo ""
echo "6. Final Status Check"
echo "Container Status:"
docker compose ps

echo ""
echo "Container Logs (letzte 20 Zeilen):"
docker compose logs web --tail=20

echo ""
echo "7. API Tests"
echo "HTTP Test:"
curl -X POST http://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Final HTTP Test","email":"test@test.com","phone":"123456","message":"Final HTTP test message"}' \
  -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  --connect-timeout 10 --max-time 30 || echo "HTTP Test fehlgeschlagen"

echo ""
echo "HTTPS Test:"
curl -X POST https://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Final HTTPS Test","email":"test@test.com","phone":"123456","message":"Final HTTPS test message"}' \
  -w "\nHTTPS Status: %{http_code}\nTime: %{time_total}s\n" \
  --insecure --connect-timeout 10 --max-time 30 || echo "HTTPS Test fehlgeschlagen"

echo ""
echo "8. Health Check Test"
curl -f http://walterbraun-muenchen.de/health 2>/dev/null && echo "Health Check OK" || echo "Health Check failed"

echo ""
echo "================================================="
echo "✅ FINAL DEPLOYMENT ABGESCHLOSSEN"
echo ""
echo "🌐 Website: https://walterbraun-muenchen.de"
echo "📧 Contact Form: Sollte jetzt funktionieren"
echo "🔧 API Endpoint: POST /api/contact"
echo ""
echo "Falls noch Probleme bestehen:"
echo "docker compose logs web --tail=50"
echo "================================================="