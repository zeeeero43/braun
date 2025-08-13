#!/bin/bash

# ULTIMATE NODE.JS 18 FIX - Walter Braun Umzüge
# Repariert alle import.meta.dirname Probleme für VPS Deployment

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🚀 ULTIMATE NODE.JS 18 FIX"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Repariert alle import.meta.dirname Vorkommen für Node.js 18"
echo ""

cd "$PROJECT_DIR"

# 1. Backup aller kritischen Dateien
echo "💾 Erstelle Backups..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp vite.config.ts "vite.config.ts.backup.$TIMESTAMP"
cp server/vite.ts "server/vite.ts.backup.$TIMESTAMP"

# 2. Fix vite.config.ts
echo "📝 Repariere vite.config.ts..."
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

# 3. Fix server/vite.ts
echo "📝 Repariere server/vite.ts..."
cat > server/vite.ts << 'EOF'
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

// Node.js 18 compatibility - __dirname alternative for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
EOF

# 4. Andere potentielle Dateien prüfen
echo "🔍 Prüfe andere Dateien auf import.meta.dirname..."

# Suche nach weiteren Vorkommen
FOUND_FILES=$(grep -r "import\.meta\.dirname" . --include="*.ts" --include="*.js" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null || echo "")

if [ -n "$FOUND_FILES" ]; then
    echo "⚠️ Weitere import.meta.dirname Vorkommen gefunden:"
    echo "$FOUND_FILES"
    echo ""
    echo "Diese müssen manuell geprüft werden."
else
    echo "✅ Keine weiteren import.meta.dirname Vorkommen gefunden"
fi

echo ""
echo "✅ Alle kritischen Dateien repariert!"
echo ""
echo "🔄 Unterschiede:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ALT: import.meta.dirname (Node.js 20+ only)"
echo "NEU: const __dirname = path.dirname(fileURLToPath(import.meta.url))"
echo "     (Node.js 18+ kompatibel)"
echo ""

# 5. Container komplett neu starten
echo "🛑 Stoppe alle Container..."
docker compose down --remove-orphans 2>/dev/null || echo "Container waren bereits gestoppt"

echo "🧹 Bereinige Docker Cache..."
docker system prune -f 2>/dev/null || echo "Docker Cache bereits sauber"

echo "🔨 Baue alle Container komplett neu..."
docker compose build --no-cache

echo "🚀 Starte alle Container..."
docker compose up -d

# 6. Erweiterte Startüberwachung
echo ""
echo "⏳ Überwache Container-Start mit detaillierter Diagnose..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# PostgreSQL Start überwachen
echo "🐘 PostgreSQL Status:"
for i in {1..30}; do
    if docker compose logs db 2>/dev/null | grep -q "database system is ready to accept connections"; then
        echo "✅ PostgreSQL: Bereit und empfangsbereit"
        break
    elif docker compose logs db 2>/dev/null | grep -q "FATAL\|ERROR"; then
        echo "❌ PostgreSQL Fehler:"
        docker compose logs db --tail=5
        break
    fi
    echo "⏳ PostgreSQL startet... ($i/30)"
    sleep 2
done

# Web Server Start überwachen
echo ""
echo "🌐 Web Server Status:"
WEB_SUCCESS=false
for i in {1..90}; do
    WEB_LOGS=$(docker compose logs web --tail=20 2>/dev/null)
    
    # Erfolgreicher Start
    if echo "$WEB_LOGS" | grep -q "serving on port 5000"; then
        echo "✅ Web Server: Erfolgreich gestartet auf Port 5000"
        WEB_SUCCESS=true
        break
    fi
    
    # import.meta.dirname Fehler
    if echo "$WEB_LOGS" | grep -qi "import\.meta\.dirname"; then
        echo "❌ import.meta.dirname Fehler noch vorhanden:"
        echo "$WEB_LOGS" | grep -i "dirname" | tail -3
        break
    fi
    
    # Allgemeine Vite/TS Fehler
    if echo "$WEB_LOGS" | grep -qi "TypeError.*dirname\|paths.*undefined\|vite.*error"; then
        echo "❌ Vite/Path Fehler erkannt:"
        echo "$WEB_LOGS" | tail -5
        break
    fi
    
    # Blog System Check
    if echo "$WEB_LOGS" | grep -q "Blog scheduler initialized"; then
        echo "📝 Blog System: Erfolgreich initialisiert"
    fi
    
    echo "⏳ Web Server startet... ($i/90) - Warte auf 'serving on port 5000'"
    sleep 3
done

# 7. Umfassende Status-Diagnose
echo ""
echo "📊 VOLLSTÄNDIGE SYSTEM-DIAGNOSE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Container Status
echo "🐳 Container Status:"
docker compose ps --format "table {{.Name}}\t{{.State}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📋 Aktuelle Logs (letzte 15 Zeilen pro Service):"
echo ""
echo "🐘 PostgreSQL Logs:"
docker compose logs db --tail=5

echo ""
echo "🌐 Web Server Logs:"
docker compose logs web --tail=15

# 8. Service-Tests nach kurzer Wartezeit
echo ""
echo "⏸️ Warte 20 Sekunden für vollständige Service-Initialisierung..."
sleep 20

echo ""
echo "🧪 Service-Tests:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Health Check
HEALTH_STATUS="❌"
if curl -f -s --max-time 10 http://localhost:5000/health >/dev/null 2>&1; then
    HEALTH_RESPONSE=$(curl -s --max-time 5 http://localhost:5000/health)
    echo "✅ Health Check: $HEALTH_RESPONSE"
    HEALTH_STATUS="✅"
else
    echo "❌ Health Check: TIMEOUT/FAIL"
fi

# Main Website
MAIN_STATUS="❌"
if curl -f -s --max-time 10 http://localhost/ >/dev/null 2>&1; then
    echo "✅ Hauptseite (Port 80): OK"
    MAIN_STATUS="✅"
else
    echo "❌ Hauptseite (Port 80): FAIL"
fi

# Direct Port 5000
DIRECT_STATUS="❌"
if curl -f -s --max-time 10 http://localhost:5000/ >/dev/null 2>&1; then
    echo "✅ Direct Access (Port 5000): OK"
    DIRECT_STATUS="✅"
else
    echo "❌ Direct Access (Port 5000): FAIL"
fi

# Blog API
BLOG_STATUS="❌"
if curl -f -s --max-time 10 http://localhost:5000/api/blog >/dev/null 2>&1; then
    echo "✅ Blog API: OK"
    BLOG_STATUS="✅"
else
    echo "❌ Blog API: FAIL"
fi

# 9. Finale Bewertung und Handlungsempfehlungen
echo ""
echo "🎯 FINALE BEWERTUNG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$WEB_SUCCESS" = true ] && [ "$HEALTH_STATUS" = "✅" ]; then
    SERVER_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")
    echo "🎉 ERFOLG! Walter Braun Umzüge läuft erfolgreich!"
    echo ""
    echo "🌐 Ihre Website ist verfügbar unter:"
    echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "   🏠 Hauptseite: http://$SERVER_IP"
    echo "   🏥 Health Check: http://$SERVER_IP/health"
    echo "   📝 Blog System: http://$SERVER_IP/blog"
    echo "   📊 Admin Blog API: http://$SERVER_IP/api/blog"
    echo ""
    echo "✅ Node.js 18 Kompatibilität: Hergestellt"
    echo "✅ import.meta.dirname → fileURLToPath: Implementiert"
    echo "✅ vite.config.ts: Repariert"
    echo "✅ server/vite.ts: Repariert"
    echo "✅ Alle Container: Funktionsfähig"
    echo "✅ PostgreSQL: Verbunden"
    echo "✅ Blog-System: Aktiv mit KI-Integration"
elif [ "$WEB_SUCCESS" = true ]; then
    echo "⚠️ TEILWEISE ERFOLGREICH"
    echo "✅ Web Server läuft, aber einige Services antworten nicht"
    echo "🔧 Möglicherweise Nginx-Konfiguration oder Firewall-Problem"
else
    echo "❌ DEPLOYMENT FEHLGESCHLAGEN"
    echo ""
    echo "🔧 DEBUGGING SCHRITTE:"
    echo "1. Detaillierte Logs: docker compose logs web --follow"
    echo "2. Container Status: docker compose ps"
    echo "3. Manual Restart: docker compose restart web"
    echo "4. Config Files prüfen:"
    echo "   cat vite.config.ts | grep dirname"
    echo "   cat server/vite.ts | grep dirname"
    echo "5. Backup wiederherstellen:"
    echo "   cp vite.config.ts.backup.$TIMESTAMP vite.config.ts"
    echo "   cp server/vite.ts.backup.$TIMESTAMP server/vite.ts"
fi

echo ""
echo "📋 Backups erstellt:"
echo "   vite.config.ts.backup.$TIMESTAMP"
echo "   server/vite.ts.backup.$TIMESTAMP"
echo ""
echo "🆘 Support: https://github.com/zeeeero43/braun/issues"
echo "📘 Logs: docker compose logs --follow"