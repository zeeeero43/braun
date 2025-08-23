#!/bin/bash

echo "🎯 Google Ads Integration Update"
echo "================================"

echo "✅ Änderungen implementiert:"
echo "• Google Ads Tag direkt in index.html integriert"
echo "• Conversion Tracking Funktion hinzugefügt"
echo "• Cookie-Consent-System weiterhin aktiv"
echo "• Doppelte Script-Ladung verhindert"

echo ""
echo "🔧 Für VPS Deployment:"
echo "1. Git Commit erstellen:"
git add client/index.html client/src/components/tracking/GoogleAdsTracking.tsx update-google-ads-integration.sh
git commit -m "Google Ads: Direct integration in HTML head

- Added Google Ads gtag script directly to index.html
- Includes conversion tracking function
- Simplified GoogleAdsTracking.tsx component
- Maintains cookie consent compatibility"

echo ""
echo "2. VPS Update mit SSL-Sicherheit:"
if [ -f "./git-safe-update.sh" ]; then
    echo "Verwende git-safe-update.sh..."
    ./git-safe-update.sh
else
    echo "Manuell auf VPS:"
    echo "cd /opt/walter-braun-umzuege"
    echo "git pull origin main"
    echo "docker compose down && docker compose up -d"
fi

echo ""
echo "================================"
echo "✅ Google Ads Integration bereit"
echo ""
echo "🎯 Tracking ID: AW-16893834151"
echo "📊 Conversion ID: AW-16893834151/n54CCJuWoIwbEKfnzfc-"
echo "🍪 DSGVO-konform mit Cookie-Consent"
echo "🌐 Lädt direkt im HTML <head>"
echo ""
echo "Nach VPS-Update verfügbar auf:"
echo "https://walterbraun-muenchen.de"
echo "================================"