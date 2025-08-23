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

# Health check endpoint - simple standalone file
COPY --chown=nextjs:nodejs <<EOF /app/health-check.js
import http from 'http';

const port = process.env.PORT || 5000;

const options = {
  hostname: 'localhost',
  port: port,
  path: '/health',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
EOF

# Create necessary directories
RUN mkdir -p uploads logs data
RUN chown nextjs:nodejs uploads logs data

USER nextjs

EXPOSE 5000

# Health check using the dedicated health check script
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node health-check.js

# Use the proper compiled server entry point
CMD ["node", "dist/server/index.js"]