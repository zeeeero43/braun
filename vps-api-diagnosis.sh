#!/bin/bash

echo "🔍 VPS API Diagnose - Warum funktioniert /api/contact nicht?"
echo "============================================================"

echo "1. Container Status prüfen:"
docker compose ps
echo ""

echo "2. Ist der Web-Container wirklich erreichbar?"
curl -I http://localhost:5000 2>/dev/null | head -3 || echo "❌ Web-Container nicht erreichbar"
echo ""

echo "3. Direct API Test am Container:"
echo "POST /api/contact Test:"
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Diagnose","email":"test@test.com","phone":"123","message":"API Diagnose Test"}' \
  -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  2>/dev/null || echo "❌ Direct API call failed"
echo ""

echo "4. Nginx vs Direct Web Test:"
echo "Via Nginx (Port 80/443):"
curl -I http://walterbraun-muenchen.de/api/contact -w "Status: %{http_code}\n" 2>/dev/null

echo "Direct Web Container (Port 5000):"
curl -I http://217.154.205.93:5000/api/contact -w "Status: %{http_code}\n" 2>/dev/null || echo "Port 5000 blocked/not accessible"
echo ""

echo "5. Container Logs - Route Registration:"
echo "Suche nach API Route Registration in Web Container:"
docker compose logs web --tail=50 | grep -E "(POST|routes|Registered|contact|api)" || echo "❌ Keine Route-Registration gefunden"
echo ""

echo "6. Container Logs - Aktuelle Requests:"
echo "Letzte API Requests:"
docker compose logs web --tail=20 | grep -E "(/api|POST|404|Cannot)" || echo "Keine aktuellen API-Requests"
echo ""

echo "7. Nginx Logs - Proxy Weiterleitung:"
echo "Nginx Container Logs:"
docker compose logs nginx --tail=15 2>/dev/null || echo "❌ Kein Nginx Container"
echo ""

echo "8. Build Timestamp Check:"
echo "Wann wurde der Web-Container zuletzt gebaut?"
docker inspect walter_braun_web --format='{{.Created}}' 2>/dev/null || echo "Container info not available"
echo ""

echo "9. Production Code Check:"
echo "Wird serve-prod.ts oder index.ts verwendet?"
docker compose exec web cat /app/dist/server/serve-prod.js | head -10 2>/dev/null | grep -E "(registerRoutes|import)" || echo "serve-prod.js check failed"
echo ""

echo "10. Manual Route Test:"
echo "Welche Routes sind registriert?"
curl -s http://walterbraun-muenchen.de/api/blog | head -3 2>/dev/null && echo "✅ /api/blog funktioniert" || echo "❌ /api/blog funktioniert nicht"
curl -s http://walterbraun-muenchen.de/api/structured-data/local-business | head -3 2>/dev/null && echo "✅ SEO routes funktionieren" || echo "❌ SEO routes funktionieren nicht"
echo ""

echo "11. Environment Check:"
docker compose exec web printenv NODE_ENV 2>/dev/null | head -1 || echo "NODE_ENV nicht verfügbar"
echo ""

echo "============================================================"
echo "📋 DIAGNOSE ZUSAMMENFASSUNG:"
echo ""
echo "Container Status: $(docker compose ps --format 'table {{.Name}}\t{{.Status}}' | tail -n +2)"
echo ""
echo "🔧 NÄCHSTE SCHRITTE basierend auf Diagnose:"
echo "   - Wenn Route Registration fehlt: Container neu bauen mit git-safe-update.sh"
echo "   - Wenn Nginx Problem: SSL-Konfiguration prüfen"  
echo "   - Wenn Container alt: git-safe-update.sh für neuen Build"
echo "============================================================"