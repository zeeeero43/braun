#!/bin/bash

echo "🔧 VPS Container Build Fix - Route Registration reparieren"
echo "=========================================================="

echo "1. Container Status vor Fix:"
docker compose ps

echo ""
echo "2. Web Container Logs - Build Fehler suchen:"
docker compose logs web --tail=30 | grep -E "(Error|error|failed|Cannot|missing)" || echo "Keine Build-Fehler in Logs"

echo ""
echo "3. Container komplett stoppen:"
docker compose down --remove-orphans

echo ""
echo "4. Alte Images und Cache löschen:"
docker system prune -f
docker volume prune -f

echo ""
echo "5. Dockerfile prüfen und Build-Process debuggen:"
echo "Dockerfile exists:" $([ -f "Dockerfile" ] && echo "✅ YES" || echo "❌ NO")
echo "package.json exists:" $([ -f "package.json" ] && echo "✅ YES" || echo "❌ NO")

echo ""
echo "6. Clean Build mit Debug-Output:"
docker compose build --no-cache --progress=plain web 2>&1 | tail -20

echo ""
echo "7. Container mit Gesundheitscheck starten:"
docker compose up -d

echo ""
echo "8. Warte auf Container Health Check (60s):"
for i in {1..12}; do
    echo "Health check $i/12..."
    HEALTH=$(docker inspect walter_braun_web --format='{{.State.Health.Status}}' 2>/dev/null)
    echo "Container health: $HEALTH"
    
    if [ "$HEALTH" = "healthy" ]; then
        echo "✅ Container ist healthy!"
        break
    fi
    sleep 5
done

echo ""
echo "9. Container Status nach Fix:"
docker compose ps

echo ""
echo "10. Web Container Logs - Route Registration prüfen:"
echo "Suche nach Route Registration:"
docker compose logs web --tail=50 | grep -E "(POST|routes|Registered|✅|API)" || echo "❌ Keine Route-Registration gefunden"

echo ""
echo "11. Container Prozesse prüfen:"
echo "Was läuft im Web Container?"
docker compose exec web ps aux 2>/dev/null || echo "Container exec nicht verfügbar"

echo ""
echo "12. Direct Container API Test:"
echo "Test /api/contact direkt am Container:"
sleep 10  # Extra Wartezeit
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Container Fix Test","email":"test@test.com","phone":"123","message":"Direct container test"}' \
  -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  --connect-timeout 10 \
  2>/dev/null || echo "❌ Direct container API noch nicht verfügbar"

echo ""
echo "13. Via Nginx Test:"
curl -X POST https://walterbraun-muenchen.de/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Nginx Fix Test","email":"test@test.com","phone":"123","message":"Via nginx test"}' \
  -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  --insecure \
  2>/dev/null || echo "Via Nginx Test fehlgeschlagen"

echo ""
echo "=========================================================="
echo "📋 CONTAINER BUILD FIX ZUSAMMENFASSUNG:"
echo ""
container_status=$(docker compose ps --format 'table {{.Name}}\t{{.Status}}' | grep walter_braun_web | awk '{print $2,$3,$4}')
echo "Web Container Status: $container_status"

health_status=$(docker inspect walter_braun_web --format='{{.State.Health.Status}}' 2>/dev/null)
echo "Health Status: $health_status"

echo ""
echo "🔧 NÄCHSTE SCHRITTE:"
if [ "$health_status" = "healthy" ]; then
    echo "✅ Container ist healthy - API sollte funktionieren"
else
    echo "❌ Container noch nicht healthy - weitere Diagnose nötig"
fi
echo "=========================================================="