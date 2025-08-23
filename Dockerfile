# Simple single-stage production build
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all source code
COPY . .

# Create data directories
RUN mkdir -p uploads logs data dist/public

# Build if needed (optional - can run from source)
RUN npm run build || echo "Build optional - running from source"

# Environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5000/health || curl -f http://localhost:5000/ || exit 1

# Start server with tsx for TypeScript support
RUN npm install -g tsx
CMD ["tsx", "server/serve-prod.ts"]