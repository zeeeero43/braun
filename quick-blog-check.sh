#!/bin/bash

# Schnelle Blog-Prüfung für Walter Braun Umzüge

echo "🔍 SCHNELLE BLOG-PRÜFUNG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd /opt/walter-braun-umzuege

# 1. Aktuelle Logs (letzte 10 Zeilen)
echo "📋 Aktuelle Generierung (letzte 10 Zeilen):"
docker compose logs web --tail=10

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 2. Blog API abfragen
echo "📝 Blog Posts im System:"
curl -s http://localhost:5000/api/blog | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        posts = data.get('posts', [])
        print(f'Anzahl Posts: {len(posts)}')
        for i, post in enumerate(posts[:3]):
            print(f'{i+1}. {post.get(\"title\", \"Kein Titel\")}')
            print(f'   Slug: {post.get(\"slug\", \"Kein Slug\")}')
            print(f'   Kategorie: {post.get(\"category\", \"Keine Kategorie\")}')
            print(f'   Status: {\"Veröffentlicht\" if post.get(\"published\") else \"Entwurf\"}')
            print()
    else:
        print('Fehler beim Abrufen der Posts')
        print(data)
except:
    print('JSON Parse Fehler')
    print(sys.stdin.read())
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 3. Frontend Blog-Seite testen
echo "🌐 Frontend Blog-Seite Test:"
BLOG_PAGE=$(curl -s http://localhost/blog 2>/dev/null)
if echo "$BLOG_PAGE" | grep -q "Walter Braun"; then
    echo "✅ Blog-Seite lädt"
    # Prüfe auf Blog-Artikel
    if echo "$BLOG_PAGE" | grep -q "article\|post\|blog-item"; then
        echo "✅ Blog-Artikel im HTML gefunden"
    else
        echo "⚠️ Blog-Seite lädt, aber keine Artikel sichtbar"
    fi
else
    echo "❌ Blog-Seite lädt nicht korrekt"
fi

echo ""
echo "🔗 Direkter Test:"
echo "   Blog API: curl http://localhost:5000/api/blog"
echo "   Blog Seite: http://$(hostname -I | awk '{print $1}')/blog"
echo "   Generieren: curl -X POST http://localhost:5000/api/blog/generate"