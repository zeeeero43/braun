#!/bin/bash

echo "🚨 EMERGENCY: Dockerfile Fix für API Routes"
echo "============================================"

echo "1. Git stash aktueller Stand (Sicherheit):"
git add . && git stash push -m "Emergency Dockerfile fix $(date)"

echo ""
echo "2. Container sofort stoppen:"
docker compose down --remove-orphans

echo ""
echo "3. Images löschen für kompletten Rebuild:"
docker system prune -f
docker image rm walter-braun-umzuege-web 2>/dev/null || echo "Image already removed"

echo ""
echo "4. Emergency Build mit fixiertem Dockerfile:"
docker compose build --no-cache --pull web

echo ""
echo "5. Container mit korrigiertem Server starten:"
docker compose up -d

echo ""
echo "6. Health Check überwachen (90s):"
for i in {1..18}; do
    echo "Health check attempt $i/18..."
    HEALTH=$(docker inspect walter_braun_web --format='{{.State.Health.Status}}' 2>/dev/null)
    echo "Container health: $HEALTH"
    
    if [ "$HEALTH" = "healthy" ]; then
        echo "✅ Container ist healthy!"
        break
    fi
    sleep 5
done

echo ""
echo "7. Route Registration Logs prüfen:"
docker compose logs web --tail=20 | grep -E "(POST|/api|routes|Registered)" || echo "Logs werden noch geladen..."

echo ""
echo "8. Direct API Test nach Fix:"
sleep 15  # Extra Zeit für Route Registration
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Emergency Fix Test","email":"test@test.com","phone":"123","message":"Testing after Dockerfile fix"}' \
  -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  --connect-timeout 15 \
  2>/dev/null && echo "✅ Direct API funktioniert!" || echo "❌ Direct API noch nicht verfügbar"

echo ""
echo "9. Via HTTPS Test:"
curl -X POST https://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"HTTPS Fix Test","email":"test@test.com","phone":"123","message":"Testing via HTTPS"}' \
  -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  --insecure \
  2>/dev/null && echo "✅ HTTPS API funktioniert!" || echo "⚠️ HTTPS API test failed"

echo ""
echo "============================================"
echo "📋 EMERGENCY FIX ERGEBNIS:"
echo ""

final_health=$(docker inspect walter_braun_web --format='{{.State.Health.Status}}' 2>/dev/null)
echo "Final Health Status: $final_health"

container_status=$(docker compose ps --format 'table {{.Name}}\t{{.Status}}' | grep walter_braun_web)
echo "Container Status: $container_status"

echo ""
if [ "$final_health" = "healthy" ]; then
    echo "✅ EMERGENCY FIX ERFOLGREICH!"
    echo "🌐 Contact Form sollte jetzt funktionieren:"
    echo "   • https://walterbraun-muenchen.de"
    echo "   • POST /api/contact verfügbar"
else
    echo "⚠️ Container noch nicht vollständig healthy"
    echo "Weitere Diagnose mit: docker compose logs web"
fi
echo "============================================"