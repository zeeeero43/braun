#!/bin/bash

echo "🔄 Erzwinge neue Blog-Generierung"
echo "================================="

echo "1. Bestehende Blogs löschen für Neustart:"
rm -f data/auto_blog_posts.json
echo "[]" > data/auto_blog_posts.json

echo ""
echo "2. Blog-Ideen zurücksetzen:"
rm -f data/blog_ideas.json
cat > data/blog_ideas.json << 'EOF'
[
  {
    "id": 1,
    "topic": "Umzug mit Haustieren: Tipps für einen entspannten Umzug mit Hund & Katze",
    "category": "Ratgeber",
    "keywords": ["Umzug", "Haustiere", "München", "Tipps"],
    "difficulty": "mittel",
    "isUsed": false,
    "createdAt": "2025-08-23T21:00:00.000Z"
  },
  {
    "id": 2,
    "topic": "Küche richtig verpacken: Schritt-für-Schritt Anleitung für den Umzug",
    "category": "Ratgeber", 
    "keywords": ["Küche packen", "Umzug", "München", "Verpackung"],
    "difficulty": "einfach",
    "isUsed": false,
    "createdAt": "2025-08-23T21:01:00.000Z"
  }
]
EOF

echo ""
echo "3. Server-Neustart erzwingen:"
pkill -f "tsx server/index.ts" 2>/dev/null || echo "Server bereits gestoppt"

echo ""
echo "4. Kurze Pause für cleanup:"
sleep 3

echo ""
echo "5. Server mit verbessertem Content-Generator starten:"
npm run dev &
SERVER_PID=$!

echo "Server PID: $SERVER_PID"

echo ""
echo "6. Warten auf Blog-Generierung (60s):"
for i in {1..12}; do
    echo "Warte... $((i*5))s"
    sleep 5
    
    # Check if blog was generated
    if [ -f "data/auto_blog_posts.json" ]; then
        BLOG_COUNT=$(cat data/auto_blog_posts.json | jq length 2>/dev/null)
        if [ "$BLOG_COUNT" != "null" ] && [ "$BLOG_COUNT" -gt 0 ]; then
            echo "✅ Blog generiert! ($BLOG_COUNT Posts)"
            break
        fi
    fi
done

echo ""
echo "7. Finale Prüfung:"
if [ -f "data/auto_blog_posts.json" ]; then
    FINAL_COUNT=$(cat data/auto_blog_posts.json | jq length 2>/dev/null)
    echo "Generierte Blogs: $FINAL_COUNT"
    
    if [ "$FINAL_COUNT" -gt 0 ]; then
        echo "✅ Blog-Inhalt generiert:"
        cat data/auto_blog_posts.json | jq '.[0] | {title, excerpt}' 2>/dev/null || echo "JSON parsing error"
    fi
else
    echo "❌ Keine Blog-Datei gefunden"
fi

echo ""
echo "================================="
echo "✅ Verbesserte Blog-Generierung gestartet"
echo "🔧 Content wird jetzt ausführlicher erstellt"
echo "📝 Fallback-System generiert vollständige Artikel"
echo "🌐 Blogs verfügbar auf /blog"
echo "================================="