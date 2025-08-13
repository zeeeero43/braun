#!/bin/bash

# Walter Braun Umzüge - Node.js Setup für Ubuntu VPS
# Installiert Node.js und alle benötigten Dependencies

set -e

echo "🚀 Node.js Setup für Walter Braun Umzüge VPS"
echo "============================================="

# 1. System Update
echo "📦 Aktualisiere System..."
apt update -y
apt upgrade -y

# 2. Node.js 18 installieren (LTS)
echo "📦 Installiere Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# 3. Zusätzliche Tools
echo "📦 Installiere zusätzliche Tools..."
apt-get install -y build-essential curl wget git

# 4. Versionen prüfen
echo "✅ Installation erfolgreich!"
echo "Node.js Version: $(node --version)"
echo "NPM Version: $(npm --version)"

# 5. Project Dependencies installieren
if [ -f "package.json" ]; then
    echo "📦 Installiere Projekt Dependencies..."
    npm ci --production=false
    echo "✅ Dependencies installiert"
else
    echo "⚠️ Keine package.json gefunden - gehen Sie in das Projektverzeichnis"
fi

echo ""
echo "🎉 Node.js Setup komplett!"
echo "Jetzt können Sie verwenden:"
echo "  ./deploy-vps.sh"
echo "  ./vps-quick-fix.sh"