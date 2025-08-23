#!/bin/bash

echo "🧪 Blog-Generierung Test"
echo "========================"

echo "1. Aktuelle Blogs abrufen:"
BLOG_COUNT=$(curl -s http://localhost:5000/api/blog-posts | jq length 2>/dev/null)
if [ "$?" -eq 0 ]; then
    echo "✅ $BLOG_COUNT Blogs gefunden"
else
    echo "⚠️ API noch nicht bereit oder keine Blogs"
fi

echo ""
echo "2. Data-Verzeichnis prüfen:"
ls -la data/ 2>/dev/null | head -5

echo ""
echo "3. Blog-Ideen Status:"
if [ -f "data/blog_ideas.json" ]; then
    echo "✅ Blog-Ideen Datei vorhanden"
    cat data/blog_ideas.json | jq '.[] | {id, topic, isUsed}' 2>/dev/null | head -10
else
    echo "❌ Keine Blog-Ideen Datei"
fi

echo ""
echo "4. Auto-Blog-Posts Status:"
if [ -f "data/auto_blog_posts.json" ]; then
    echo "✅ Auto-Blog-Posts Datei vorhanden"
    POSTS_COUNT=$(cat data/auto_blog_posts.json | jq length 2>/dev/null)
    echo "Posts in Datei: $POSTS_COUNT"
else
    echo "❌ Keine Auto-Blog-Posts Datei"
fi

echo ""
echo "5. Server-Logs für Blog-Generierung:"
echo "Letzte Blog-bezogene Log-Einträge:"

echo ""
echo "========================"
echo "📊 Blog-System Status"
echo "• API Blogs: $BLOG_COUNT"
echo "• File Blogs: $POSTS_COUNT" 
echo "• Generation läuft..."
echo "========================"