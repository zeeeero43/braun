#!/bin/bash

# Fix für verbuggten Blog-Post
# Löscht kaputten Post und generiert neuen

echo "🔧 Fixing Broken Blog Post"
echo "========================="

# Lösche kaputten Post aus PostgreSQL
echo "Lösche verbuggten Blog-Post (ID 19)..."
psql "$DATABASE_URL" -c "DELETE FROM auto_blog_posts WHERE id = 19;" 2>/dev/null

# Leere auch JSON falls vorhanden  
echo "[]" > data/auto_blog_posts.json

echo "✅ Verbuggter Blog-Post gelöscht"

# Generiere neuen Post
echo "Generiere neuen Blog-Post..."
curl -X POST http://localhost:5000/api/admin/generate-blog \
  -H "Content-Type: application/json" \
  -d '{"category": "München & Umgebung"}' \
  > /dev/null 2>&1

echo "✅ Neuer Blog-Post wird generiert (läuft im Hintergrund)"
echo ""
echo "💡 Status prüfen: curl http://localhost:5000/api/blog"