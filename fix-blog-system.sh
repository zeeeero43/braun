#!/bin/bash

echo "🛠️ Blog System Reparatur"
echo "========================"

echo "1. Data-Verzeichnis erstellen:"
mkdir -p data
chmod 755 data

echo ""
echo "2. Bestehende Blog-Daten prüfen:"
ls -la data/ 2>/dev/null || echo "Keine Data-Dateien gefunden"

echo ""
echo "3. Test Blog-Generierung starten:"
echo "JSON-Parsing wurde verbessert, Server neu starten..."

# Kill existing server if running
pkill -f "tsx server/index.ts" 2>/dev/null || echo "Kein Server gefunden"

echo ""
echo "4. Server neu starten für Blog-Fix:"
npm run dev &
SERVER_PID=$!

echo "Server PID: $SERVER_PID"

echo ""
echo "5. 15 Sekunden warten für Blog-Generierung:"
sleep 15

echo ""
echo "6. Blog-Status prüfen:"
curl -s http://localhost:5000/api/blog-posts | jq length 2>/dev/null || echo "Keine Blogs verfügbar oder Server noch nicht bereit"

echo ""
echo "7. Data-Verzeichnis nach Generierung:"
ls -la data/ 2>/dev/null || echo "Noch keine Data-Dateien"

echo ""
echo "========================"
echo "✅ Blog System Fix angewendet"
echo ""
echo "🔧 Verbesserungen:"
echo "• Robustes JSON-Parsing mit Fallbacks"
echo "• Data-Verzeichnis sichergestellt"
echo "• Multiple Parsing-Methoden"
echo ""
echo "🔄 Server läuft mit PID: $SERVER_PID"
echo "📝 Blogs sollten jetzt generiert werden"
echo "========================"