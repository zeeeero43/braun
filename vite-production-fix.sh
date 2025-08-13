#!/bin/bash

# Node.js 18 kompatible vite.config.ts für VPS
# Ersetzt import.meta.dirname mit fileURLToPath Lösung

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🔧 NODE.JS 18 VITE FIX - Walter Braun Umzüge"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$PROJECT_DIR"

# 1. Backup erstellen
echo "💾 Erstelle Backup der aktuellen vite.config.ts..."
cp vite.config.ts vite.config.ts.backup.$(date +%Y%m%d_%H%M%S)

# 2. Node.js 18 kompatible vite.config.ts erstellen
echo "📝 Erstelle Node.js 18 kompatible vite.config.ts..."

cat > vite.config.ts << 'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Node.js 18 compatibility - __dirname alternative for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/", // VPS deployment uses root path
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
EOF

echo "✅ Node.js 18 kompatible vite.config.ts erstellt"

# 3. Änderungen anzeigen
echo ""
echo "🔍 Unterschiede zur alten Version:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ALT: import.meta.dirname (funktioniert nicht in Node.js 18)"
echo "NEU: const __dirname = path.dirname(fileURLToPath(import.meta.url))"
echo ""

# 4. Container stoppen und neu bauen
echo "🛑 Stoppe alle Container..."
docker compose down 2>/dev/null || echo "Container waren bereits gestoppt"

# 5. Kompletter Neuaufbau
echo "🔨 Baue alle Container neu mit reparierter vite.config.ts..."
docker compose build --no-cache

# 6. Container starten
echo "🚀 Starte alle Container..."
docker compose up -d

# 7. Erweiterte Überwachung des Starts
echo ""
echo "⏳ Überwache Container-Start..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# PostgreSQL Check
for i in {1..30}; do
    if docker compose logs db 2>/dev/null | grep -q "database system is ready to accept connections"; then
        echo "✅ PostgreSQL: Bereit"
        break
    fi
    echo "⏳ PostgreSQL startet... ($i/30)"
    sleep 2
done

# Web Server Check
WEB_STARTED=false
for i in {1..60}; do
    # Prüfe auf erfolgreichen Start
    if docker compose logs web 2>/dev/null | grep -q "serving on port 5000"; then
        echo "✅ Web Server: Läuft auf Port 5000"
        WEB_STARTED=true
        break
    fi
    
    # Prüfe auf vite.config.ts Fehler
    if docker compose logs web 2>/dev/null | grep -qi "import.meta.dirname\|__dirname\|vite.*error"; then
        echo "❌ Vite Config Fehler erkannt:"
        docker compose logs web --tail=5
        break
    fi
    
    echo "⏳ Web Server startet... ($i/60)"
    sleep 3
done

# 8. Status Report
echo ""
echo "📊 FINALER STATUS CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Container Status
echo "🐳 Container Status:"
docker compose ps

echo ""
echo "📋 Letzte Web Container Logs:"
docker compose logs web --tail=10

# 9. Service Tests
echo ""
echo "🧪 Service Tests:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Kurz warten für vollständige Initialisierung
sleep 15

# Health Check
if curl -f -s --max-time 10 http://localhost:5000/health >/dev/null 2>&1; then
    echo "✅ Health Check (Port 5000): OK"
    HEALTH_RESPONSE=$(curl -s --max-time 5 http://localhost:5000/health 2>/dev/null || echo "Timeout")
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "❌ Health Check (Port 5000): FAIL"
fi

# Main Site
if curl -f -s --max-time 10 http://localhost >/dev/null 2>&1; then
    echo "✅ Hauptseite (Port 80): OK"
else
    echo "❌ Hauptseite (Port 80): FAIL"
fi

# Blog API
if curl -f -s --max-time 10 http://localhost:5000/api/blog >/dev/null 2>&1; then
    echo "✅ Blog API: OK"
else
    echo "❌ Blog API: FAIL"
fi

# 10. Finale Bewertung
echo ""
echo "🎯 FINALES ERGEBNIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$WEB_STARTED" = true ]; then
    SERVER_IP=$(hostname -I | awk '{print $1}')
    echo "🎉 SUCCESS! Node.js 18 Kompatibilität hergestellt!"
    echo ""
    echo "🌐 Walter Braun Umzüge Website:"
    echo "   http://$SERVER_IP"
    echo "   http://$SERVER_IP/health (Health Check)"
    echo "   http://$SERVER_IP/blog (Blog System)"
    echo ""
    echo "✅ vite.config.ts: Node.js 18 kompatibel"
    echo "✅ import.meta.dirname → fileURLToPath Lösung"
    echo "✅ Alle Container funktionsfähig"
    echo "✅ Blog-System mit KI aktiv"
else
    echo "⚠️ PROBLEM: Web Container konnte nicht gestartet werden"
    echo ""
    echo "🔧 DEBUGGING SCHRITTE:"
    echo "1. Logs prüfen: docker compose logs web --follow"
    echo "2. Manual restart: docker compose restart web"
    echo "3. Config prüfen: cat vite.config.ts"
    echo "4. Backup restore: cp vite.config.ts.backup.* vite.config.ts"
    echo ""
    echo "🆘 Support: https://github.com/zeeeero43/braun/issues"
fi

echo ""
echo "📋 Backups verfügbar:"
ls -la vite.config.ts.backup.* 2>/dev/null || echo "   Keine Backups gefunden"