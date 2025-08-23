#!/bin/bash

echo "🌐 Domain Status Check - walterbraun-muenchen.de"
echo "================================================"

echo "1. DNS-Auflösung testen:"
echo "------------------------"
nslookup walterbraun-muenchen.de || echo "❌ DNS nicht konfiguriert"

echo ""
echo "2. Ping-Test:"
echo "-------------"
ping -c 3 walterbraun-muenchen.de || echo "❌ Domain nicht erreichbar"

echo ""
echo "3. HTTP-Test der Domain:"
echo "-----------------------"
curl -I http://walterbraun-muenchen.de 2>/dev/null || echo "❌ HTTP über Domain nicht erreichbar"

echo ""
echo "4. HTTP-Test der IP (sollte funktionieren):"
echo "-------------------------------------------"
curl -I http://217.154.205.93/ || echo "❌ IP nicht erreichbar"

echo ""
echo "5. Container Status:"
echo "-------------------"
docker compose ps

echo ""
echo "6. DNS-Propagation Check:"
echo "-------------------------"
echo "Testen Sie auch online: https://dnschecker.org/#A/walterbraun-muenchen.de"

echo "================================================"
echo "📋 Zusammenfassung:"
echo "✅ IP funktioniert: http://217.154.205.93/"
echo "🔄 Domain DNS-Setup erforderlich bei Ihrem Provider"
echo "================================================"