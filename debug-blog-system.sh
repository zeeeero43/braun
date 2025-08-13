#!/bin/bash

# Debug Blog System für Walter Braun Umzüge VPS
# Prüft API-Schlüssel und Blog-Generation

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🔍 BLOG SYSTEM DEBUGGING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$PROJECT_DIR"

# 1. Container Status prüfen
echo "🐳 Container Status:"
docker compose ps

echo ""
echo "📋 Aktuelle Web Container Logs (letzte 20 Zeilen):"
docker compose logs web --tail=20

# 2. Umgebungsvariablen im Container prüfen
echo ""
echo "🔑 API-Schlüssel im Container prüfen:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# DEEPSEEK Key prüfen
DEEPSEEK_STATUS=$(docker compose exec -T web printenv DEEPSEEK_API_KEY 2>/dev/null && echo "EXISTS" || echo "MISSING")
if [ "$DEEPSEEK_STATUS" = "MISSING" ]; then
    echo "❌ DEEPSEEK_API_KEY: FEHLT"
else
    DEEPSEEK_LENGTH=$(docker compose exec -T web printenv DEEPSEEK_API_KEY 2>/dev/null | wc -c)
    echo "✅ DEEPSEEK_API_KEY: Vorhanden ($DEEPSEEK_LENGTH Zeichen)"
fi

# RUNWARE Key prüfen
RUNWARE_STATUS=$(docker compose exec -T web printenv RUNWARE_API_KEY 2>/dev/null && echo "EXISTS" || echo "MISSING")
if [ "$RUNWARE_STATUS" = "MISSING" ]; then
    echo "❌ RUNWARE_API_KEY: FEHLT"
else
    RUNWARE_LENGTH=$(docker compose exec -T web printenv RUNWARE_API_KEY 2>/dev/null | wc -c)
    echo "✅ RUNWARE_API_KEY: Vorhanden ($RUNWARE_LENGTH Zeichen)"
fi

# 3. .env Datei prüfen
echo ""
echo "📄 .env Datei Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env" ]; then
    echo "✅ .env Datei existiert"
    echo ""
    echo "📋 .env Inhalt (API-Schlüssel werden maskiert):"
    sed 's/sk-[a-zA-Z0-9]*\{10,\}/sk-***MASKED***/g; s/=[a-zA-Z0-9]\{20,\}/=***MASKED***/g' .env
else
    echo "❌ .env Datei existiert NICHT"
    echo ""
    echo "🔧 .env Template:"
    cat .env.template
fi

# 4. Blog API direkt testen
echo ""
echo "🧪 Blog API Tests:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Aktuelle Blog Posts
echo "📝 Aktuelle Blog Posts:"
BLOG_RESPONSE=$(curl -s --max-time 10 http://localhost:5000/api/blog 2>/dev/null || echo "ERROR")
if [ "$BLOG_RESPONSE" = "ERROR" ]; then
    echo "❌ Blog API nicht erreichbar"
else
    echo "$BLOG_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$BLOG_RESPONSE"
fi

# 5. Blog Generation Test mit detaillierten Logs
echo ""
echo "🔄 Blog-Generierung testen (mit Live-Logs):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Logs in Hintergrund verfolgen
docker compose logs web --follow &
LOG_PID=$!

sleep 2

echo "📤 Sende Blog-Generierung Request..."
GENERATE_RESPONSE=$(curl -s -X POST --max-time 30 http://localhost:5000/api/blog/generate 2>/dev/null || echo "ERROR")

sleep 5

# Log-Verfolgung stoppen
kill $LOG_PID 2>/dev/null || true

echo ""
echo "📥 Blog-Generierung Response:"
if [ "$GENERATE_RESPONSE" = "ERROR" ]; then
    echo "❌ Request fehlgeschlagen"
else
    echo "$GENERATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$GENERATE_RESPONSE"
fi

# 6. Finale Diagnose
echo ""
echo "🎯 DIAGNOSE ERGEBNIS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$DEEPSEEK_STATUS" = "MISSING" ] || [ "$RUNWARE_STATUS" = "MISSING" ]; then
    echo "❌ HAUPTPROBLEM: API-Schlüssel fehlen"
    echo ""
    echo "🔧 LÖSUNGSSCHRITTE:"
    echo "1. .env Datei erstellen:"
    echo "   cat > .env << 'EOF'"
    echo "   POSTGRES_PASSWORD=WalterBraun2024SecureDB!"
    echo "   DEEPSEEK_API_KEY=sk-ihr-echter-deepseek-key"
    echo "   RUNWARE_API_KEY=ihr-echter-runware-key"
    echo "   SESSION_SECRET=WalterBraunUmzuege2024SuperSecureSessionKey123!"
    echo "   DATABASE_URL=postgresql://postgres:WalterBraun2024SecureDB!@db:5432/walter_braun_umzuege"
    echo "   EOF"
    echo ""
    echo "2. Container neu starten:"
    echo "   docker compose down && docker compose up -d"
    echo ""
    echo "3. API-Schlüssel besorgen:"
    echo "   DeepSeek: https://platform.deepseek.com/api_keys"
    echo "   Runware: https://runware.ai/console"
else
    echo "✅ API-Schlüssel sind vorhanden"
    echo "🔧 Prüfen Sie die Container-Logs für weitere Details:"
    echo "   docker compose logs web --follow"
fi

echo ""
echo "📋 Für weitere Diagnose:"
echo "   docker compose logs web --tail=50"
echo "   curl -v -X POST http://localhost:5000/api/blog/generate"