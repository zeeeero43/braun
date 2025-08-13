#!/bin/bash

# Walter Braun Umzüge - Schneller VPS Fix für Vite Import Fehler
# Löst das "Cannot find package 'vite'" Problem in Produktion

set -e

echo "🔧 VPS Quick Fix - Vite Import Fehler beheben"
echo "============================================="

# 1. Stoppe laufende Prozesse
echo "🛑 Stoppe laufende Prozesse..."
pkill -f "node.*dist/index.js" || echo "Kein laufender Prozess gefunden"
pkill -f "npm.*start" || echo "Kein npm start Prozess gefunden"

# 2. Baue die Anwendung neu
echo "🏗️ Baue Anwendung neu..."
npm run build

# 3. Starte in Produktion
echo "🚀 Starte in Produktionsmodus..."
NODE_ENV=production PORT=5000 nohup node dist/index.js > app.log 2>&1 &

# 4. Warte auf Start
sleep 3

# 5. Teste
echo "🧪 Teste Anwendung..."
if curl -f -s --max-time 10 http://localhost:5000/health >/dev/null 2>&1; then
    echo "✅ ERFOLGREICH! Anwendung läuft."
    echo "🌐 URL: http://$(hostname -I | awk '{print $1}'):5000"
    echo "📋 Logs: tail -f app.log"
else
    echo "❌ Fehler beim Starten. Logs prüfen:"
    echo "📋 Logs: cat app.log"
    exit 1
fi