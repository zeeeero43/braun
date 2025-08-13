#!/bin/bash

# Walter Braun Umzüge - Manueller VPS Fix (ohne npm)
# Direkter Fix für Vite Import Problem ohne Node.js Build

set -e

echo "🔧 Manueller VPS Fix - Direkter Ansatz"
echo "====================================="

# 1. Prüfe ob dist Verzeichnis existiert
if [ ! -d "dist" ]; then
    echo "📁 Erstelle dist Verzeichnis..."
    mkdir -p dist
fi

# 2. Kopiere Server-Dateien direkt (ohne Build)
echo "📄 Kopiere Server-Dateien..."
cp -r server/* dist/ 2>/dev/null || echo "Server-Dateien bereits vorhanden"

# 3. Erstelle einfachen Start-Script
echo "📝 Erstelle Start-Script..."
cat > start-server.js << 'EOF'
// Einfacher Express Server ohne Vite
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Static Files
const publicPath = path.resolve(process.cwd(), 'public');
if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
    console.log(`Serving static files from: ${publicPath}`);
}

// Fallback
app.get('*', (req, res) => {
    const indexPath = path.resolve(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send(`
            <html>
                <head><title>Walter Braun Umzüge</title></head>
                <body>
                    <h1>Walter Braun Umzüge</h1>
                    <p>Server läuft erfolgreich auf Port ${PORT}</p>
                    <p>Status: <a href="/health">Health Check</a></p>
                </body>
            </html>
        `);
    }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Walter Braun Umzüge Server läuft auf Port ${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
});
EOF

# 4. Stoppe alte Prozesse
echo "🛑 Stoppe alte Prozesse..."
pkill -f "node.*start-server.js" || echo "Kein alter Prozess gefunden"
pkill -f "node.*dist/index.js" || echo "Kein dist Prozess gefunden"

# 5. Starte Server
echo "🚀 Starte Server..."
nohup node start-server.js > server.log 2>&1 &

# 6. Warte und teste
sleep 3
echo "🧪 Teste Server..."

if curl -f -s --max-time 10 http://localhost:5000/health >/dev/null 2>&1; then
    echo "✅ SUCCESS! Server läuft erfolgreich"
    echo "🌐 URL: http://$(hostname -I | awk '{print $1}'):5000"
    echo "🏥 Health: http://$(hostname -I | awk '{print $1}'):5000/health"
    echo "📋 Logs: tail -f server.log"
else
    echo "❌ Server antwortet nicht. Logs prüfen:"
    echo "📋 cat server.log"
    exit 1
fi