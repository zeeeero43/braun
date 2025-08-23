#!/bin/bash

echo "🎨 Favicon Update für VPS"
echo "========================"

echo "1. Git Stash (Sicherheit):"
git add . && git stash push -m "Favicon update $(date)"

echo ""
echo "2. Neue Dateien zu Git hinzufügen:"
git add client/public/favicon.png
git add client/index.html
git add client/src/components/seo/SEOHead.tsx
git add update-vps-favicon.sh

echo ""
echo "3. Commit erstellen:"
git commit -m "Add favicon: Lieferwagen icon for Walter Braun Umzüge

- Added favicon.png to client/public/
- Updated index.html with favicon links
- Updated SEOHead.tsx with favicon meta tags
- Ready for VPS deployment"

echo ""
echo "4. SSL-sichere VPS Updates:"
if [ -f "./git-safe-update.sh" ]; then
    echo "Verwende git-safe-update.sh für VPS..."
    ./git-safe-update.sh
else
    echo "⚠️ git-safe-update.sh nicht gefunden"
    echo "Manuelle VPS Updates erforderlich:"
    echo ""
    echo "Auf VPS ausführen:"
    echo "cd /opt/walter-braun-umzuege"
    echo "git pull origin main"
    echo "docker compose down"
    echo "docker compose build --no-cache web"
    echo "docker compose up -d"
    echo ""
    echo "Dann SSL Check:"
    echo "./quick-ssl-restore.sh"
fi

echo ""
echo "========================"
echo "✅ Favicon Update bereit"
echo ""
echo "🎯 Das Favicon (Lieferwagen) ist jetzt:"
echo "   • In client/public/favicon.png"
echo "   • Registriert in index.html"  
echo "   • Konfiguriert in SEOHead.tsx"
echo ""
echo "📤 Für VPS: git-safe-update.sh verwenden"
echo "🌐 Nach Update sichtbar in Browser-Tab"
echo "========================"