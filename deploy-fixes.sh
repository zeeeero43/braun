#!/bin/bash

echo "🔧 Deploy Git Update + Contact Form Fix"
echo "========================================"

echo "1. Container stoppen..."
docker compose down

echo ""
echo "2. Container mit Fixes neu bauen..."
docker compose build --no-cache

echo ""
echo "3. Container starten..."
docker compose up -d

echo ""
echo "4. Warte auf Start (30s)..."
sleep 30

echo ""
echo "5. Container Status:"
docker compose ps

echo ""
echo "6. Container Logs für Route-Debugging:"
docker compose logs web --tail=20

echo ""
echo "7. Test /api/contact Route:"
curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","message":"Test message","phone":"+49123456789"}' \
     http://localhost/api/contact

echo ""
echo "8. Test über Domain:"
curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","message":"Test message","phone":"+49123456789"}' \
     http://walterbraun-muenchen.de/api/contact

echo ""
echo "9. Test weitere API-Endpunkte:"
echo "Health Check:"
curl -I http://localhost/api/health || echo "Health endpoint fehlt"
echo "Blog API:"
curl -I http://localhost/api/blog || echo "Blog API fehlt"

echo "========================================"
echo "✅ Deploy Fixes abgeschlossen!"
echo ""
echo "📝 Verfügbare Scripts:"
echo "   ./git-safe-update.sh           # Sicheres Git-Update"
echo "   ./fix-contact-form-api.sh      # Contact API Diagnose"
echo "   ./deploy-fixes.sh              # Alle Fixes deployen"
echo ""
echo "🌐 Website sollte funktionieren:"
echo "   http://walterbraun-muenchen.de"
echo "   https://walterbraun-muenchen.de"
echo "========================================"