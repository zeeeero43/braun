#!/bin/bash

echo "🚨 Emergency VPS Fix - Korrigiere Dockerfile direkt auf VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Gehe zum Projekt-Verzeichnis
cd /opt/walter-braun-umzuege

# Sichere aktuelles Dockerfile
cp Dockerfile.production Dockerfile.production.backup

# Erstelle neues Dockerfile ohne TypeScript-Kompilierung
cat > Dockerfile.production << 'EOL'
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

# Build frontend only
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

# Install tsx und esbuild für TypeScript execution  
RUN npm install tsx esbuild

# Create production server startup script
COPY --chown=nextjs:nodejs <<'EOF' /app/serve-production.js
// Production server startup - verwendet tsx für vollständige TypeScript Unterstützung
import { spawn } from 'child_process';

function log(message, source = "production") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

log('🚀 Starting Walter Braun Umzüge Production Server...');
log('🔧 Using tsx for TypeScript execution with full Blog system');

// Environment setup
process.env.NODE_ENV = 'production';

// Start production server with tsx
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

// Graceful shutdown
function shutdown(signal) {
  log(`📡 ${signal} received, shutting down gracefully...`);
  serverProcess.kill(signal);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

log('✅ Production wrapper started successfully');
EOF

# Set permissions
USER nextjs
EXPOSE 5000
CMD ["node", "serve-production.js"]
EOL

echo "✅ Dockerfile.production korrigiert!"
echo "🔄 Starte Docker-Rebuild..."

# Stoppe alte Container
docker compose down

# Rebuild mit neuem Dockerfile
docker compose up --build -d

echo "🏁 Emergency Fix abgeschlossen!"
echo "📊 Container Status:"
docker compose ps

echo "🏥 Health Check:"
sleep 10
curl -f http://localhost/health && echo "✅ Website läuft!" || echo "❌ Problem erkannt"
EOL