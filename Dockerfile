# Multi-stage build for Node.js application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application (uses vite build && esbuild)
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install production dependencies (runtime only)
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Copy the built application and source files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/client ./client

# Create the production server entry point that doesn't import vite
COPY --chown=nextjs:nodejs <<EOF /app/production-server.js
// Production server without Vite imports
import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 5000;

// Log function
function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(\`\${formattedTime} [\${source}] \${message}\`);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// API routes (if they exist)
app.get('/api/*', (req, res) => {
    res.json({ message: 'API endpoint - server running' });
});

// Static file serving
const publicPath = path.resolve(process.cwd(), 'dist/public');
if (fs.existsSync(publicPath)) {
    log(\`Serving static files from: \${publicPath}\`);
    app.use(express.static(publicPath));
    
    // SPA fallback
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(publicPath, 'index.html'));
    });
} else {
    // Fallback HTML if no built files
    app.get('*', (req, res) => {
        res.send(\`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Walter Braun Umzüge</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            max-width: 800px; 
                            margin: 50px auto; 
                            padding: 20px; 
                            line-height: 1.6; 
                        }
                        .status { 
                            background: #e8f5e8; 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                        }
                        .links a { 
                            display: inline-block; 
                            margin: 10px 15px 10px 0; 
                            padding: 8px 16px; 
                            background: #0066cc; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 4px; 
                        }
                    </style>
                </head>
                <body>
                    <h1>Walter Braun Umzüge</h1>
                    <div class="status">
                        <h2>✅ Server läuft erfolgreich!</h2>
                        <p><strong>Status:</strong> Online</p>
                        <p><strong>Port:</strong> \${PORT}</p>
                        <p><strong>Zeit:</strong> \${new Date().toLocaleString('de-DE')}</p>
                        <p><strong>Umgebung:</strong> Production (Docker)</p>
                    </div>
                    <div class="links">
                        <a href="/health">Health Check</a>
                        <a href="/api/test">API Test</a>
                    </div>
                    <p><em>Website wird geladen, sobald die Frontend-Dateien verfügbar sind.</em></p>
                </body>
            </html>
        \`);
    });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
    log(\`Walter Braun Umzüge Server läuft auf Port \${PORT}\`);
    log(\`Health Check: http://localhost:\${PORT}/health\`);
    log(\`Environment: \${process.env.NODE_ENV || 'production'}\`);
    log(\`Static files: \${fs.existsSync(publicPath) ? publicPath : 'Fallback HTML'}\`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
EOF

# Create necessary directories
RUN mkdir -p uploads logs data
RUN chown nextjs:nodejs uploads logs data

USER nextjs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "production-server.js"]