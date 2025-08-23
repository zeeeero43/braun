// Production server für VPS - vollständiges Blog-System ohne Vite
import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Log function
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit", 
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();

// Trust proxy for correct Host header handling
app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Host header debugging and fix
app.use((req, res, next) => {
  // Log all requests with host info
  log(`${req.method} ${req.path} - Host: ${req.get('host')} - IP: ${req.ip}`);
  
  // Ensure proper host header handling for domain
  const host = req.get('host');
  if (host === 'walterbraun-muenchen.de' || host === 'www.walterbraun-muenchen.de') {
    // Domain requests - continue normally
    next();
  } else if (host && host.includes('217.154.205.93')) {
    // IP requests - continue normally  
    next();
  } else if (host === 'localhost' || host?.startsWith('localhost:')) {
    // Local requests - continue normally
    next();
  } else {
    // Unknown host - still allow but log
    log(`Unknown host: ${host}`, 'warning');
    next();
  }
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

async function startServer() {
  try {
    // CRITICAL: Add SEO routes first (like index.ts does)
    const seoRoutes = await import("./routes/seo.js");
    const seoToolsRoutes = await import("./routes/seo-tools.js");
    app.use(seoRoutes.default);
    app.use(seoToolsRoutes.default);
    log("✅ SEO routes registered");

    // Import und registriere API Routes
    const { registerRoutes } = await import("./routes.js");
    const server = await registerRoutes(app);
    log("✅ API routes registered");
    
    // Debug: Liste alle registrierten API Routes
    log("📋 Registered API routes:");
    const apiRoutes = [];
    if (app._router && app._router.stack) {
      app._router.stack.forEach((middleware: any) => {
        if (middleware.route && middleware.route.path && middleware.route.path.startsWith('/api')) {
          const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
          const routeInfo = `  ${methods} ${middleware.route.path}`;
          apiRoutes.push(routeInfo);
          log(routeInfo);
        }
      });
    }
    
    if (apiRoutes.length === 0) {
      log("⚠️ WARNING: No API routes found! This will cause 404 errors.");
    }
    
    // Error handler BEFORE static files
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      log(`Error ${status}: ${message}`, "error");
    });

    // Static files serving AFTER API routes (critical order)
    setupStaticFiles(app);
    log("✅ Static file serving configured");
    
    // Starte Blog-System
    const { startBlogScheduler } = await import("./ai/blogScheduler.js");
    log("🤖 Starting automated blog system...");
    await startBlogScheduler();
    log("✅ Blog scheduler initialized successfully");

    const port = parseInt(process.env.PORT || "5000");
    const publicPath = path.resolve(__dirname, "../dist/public");
    app.listen(port, "0.0.0.0", () => {
      log(`🚀 Walter Braun Umzüge Production Server auf Port ${port}`);
      log(`🏥 Health Check: http://localhost:${port}/health`);
      log(`🌍 Environment: ${process.env.NODE_ENV || "production"}`);
      log(`📁 Static files: ${publicPath}`);
      log(`✅ Vollständiges Blog-System aktiv`);
    });

  } catch (error) {
    log(`Server Start Error: ${(error as Error).message}`, "error");
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Export function for use by index.ts
export function serveStatic(app: express.Application) {
  setupStaticFiles(app);
}

// Function to setup static file serving
function setupStaticFiles(app: express.Application) {
  const publicPath = path.resolve(__dirname, "../dist/public");
  log(`📁 Setting up static files from: ${publicPath}`);
  
  // Serve static files but NOT for API routes
  app.use(express.static(publicPath));
  
  // SPA fallback - serve index.html ONLY for non-API routes
  // This must be the LAST route to avoid intercepting API calls
  app.get("*", (req, res, next) => {
    // Skip API routes - let them return 404 if not found
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    log(`SPA fallback serving index.html for: ${req.path}`);
    res.sendFile(path.resolve(publicPath, "index.html"));
  });
}

// For standalone execution (e.g., docker)
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}