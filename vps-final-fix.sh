#!/bin/bash

echo "🔧 FINALE VPS KORREKTUR - Webseite + Blog System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd /opt/walter-braun-umzuege

# 1. Hole neueste Version von Replit
echo "📥 Hole aktuelle Version von Git..."
git stash
git pull origin main || echo "Git pull übersprungen"

# 2. Erstelle korrektes Dockerfile OHNE TypeScript-Kompilierung
echo "✅ Erstelle korrektes Dockerfile.production..."
cat > Dockerfile.production << 'DOCKERFILE_END'
# Production Dockerfile für Walter Braun Umzüge mit Blog-System
FROM node:18-alpine AS base

# Dependencies Stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Builder Stage 
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build frontend only (KEINE TypeScript-Kompilierung!)
RUN npm run build

# Production Stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application and all server files
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/shared ./shared
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

# Install tsx für TypeScript execution  
RUN npm install tsx esbuild

# Create production server startup script
COPY --chown=nextjs:nodejs <<'EOF' /app/serve-production.js
// Production server - startet TypeScript mit tsx
import { spawn } from 'child_process';

function log(message, source = "production") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

log('🚀 Starting Walter Braun Umzüge Production Server...');
log('🔧 Using tsx for TypeScript execution with full Blog system');

process.env.NODE_ENV = 'production';

const serverProcess = spawn('npx', ['tsx', 'server/serve-prod.ts'], {
  stdio: 'inherit',
  env: process.env,
  cwd: process.cwd()
});

serverProcess.on('error', (error) => {
  log(`❌ Failed to start server: ${error.message}`, 'error');
  process.exit(1);
});

serverProcess.on('exit', (code, signal) => {
  if (signal) {
    log(`🔄 Server process killed by signal ${signal}`, 'info');
  } else {
    log(`❌ Server process exited with code ${code}`, 'error');
  }
  process.exit(code || 1);
});

process.on('SIGTERM', () => {
  log('📡 SIGTERM received, shutting down gracefully...');
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  log('📡 SIGINT received, shutting down gracefully...');
  serverProcess.kill('SIGINT');
});

log('✅ Production wrapper started successfully');
EOF

USER nextjs
EXPOSE 5000
CMD ["node", "serve-production.js"]
DOCKERFILE_END

# 3. Stoppe alte Container
echo "🛑 Stoppe alte Container..."
docker compose down

# 4. Lösche Docker Cache für sauberen Build
echo "🧹 Lösche Docker Build Cache..."
docker system prune -f

# 5. Baue und starte Container neu
echo "🔨 Baue Docker Container neu..."
docker compose up --build -d

# 6. Warte auf Start
echo "⏱️ Warte 20 Sekunden auf Container-Start..."
sleep 20

# 7. Prüfe Status
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 CONTAINER STATUS:"
docker compose ps

echo ""
echo "📋 WEB CONTAINER LOGS (letzte 20 Zeilen):"
docker compose logs web --tail 20

echo ""
echo "🏥 HEALTH CHECK:"
if curl -f -s http://localhost/health; then
    echo "✅ Website läuft!"
else
    echo "⚠️ Website noch nicht bereit, prüfe mit:"
    echo "   docker compose logs web -f"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 FERTIG! Prüfen Sie:"
echo "   🌐 Website: http://217.154.205.93"
echo "   🏥 Health: http://217.154.205.93/health"
echo "   📋 Logs: docker compose logs web -f"
echo ""
echo "✅ Webseite + Blog-System sollten jetzt funktionieren!"