#!/bin/bash

# Quick Fix für bereits existierendes Verzeichnis
# Verwendung: bash quick-fix-deploy.sh https://github.com/zeeeero43/braun.git

set -e

REPO_URL="$1"
PROJECT_DIR="/opt/walter-braun-umzuege"

if [[ -z "$REPO_URL" ]]; then
    echo "❌ Fehler: Repository URL fehlt"
    echo "Verwendung: $0 <repository-url>"
    echo "Beispiel: $0 https://github.com/zeeeero43/braun.git"
    exit 1
fi

echo "🔄 Behebe Git Clone Problem..."

# Ins Projektverzeichnis wechseln
cd "$PROJECT_DIR"

# Komplett leeren und neu klonen
echo "📂 Lösche bestehendes Verzeichnis..."
rm -rf .git
rm -rf *
rm -rf .*env* 2>/dev/null || true

echo "📥 Klone Repository neu..."
git clone "$REPO_URL" .

echo "📋 Repository Inhalt:"
ls -la

# Wichtige Dateien prüfen
echo "✅ Prüfe wichtige Dateien..."
for file in "docker-compose.yml" "Dockerfile" "package.json"; do
    if [[ -f "$file" ]]; then
        echo "✓ $file gefunden"
    else
        echo "❌ $file fehlt!"
        exit 1
    fi
done

# Environment Datei erstellen
echo "🔧 Erstelle .env Datei..."
if [[ -f ".env.template" ]]; then
    cp .env.template .env
else
    cat > .env << 'EOF'
# Database Configuration
POSTGRES_PASSWORD=WalterBraun_Secure_2024!

# API Keys - ERSETZEN SIE DIESE MIT IHREN ECHTEN SCHLÜSSELN
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
RUNWARE_API_KEY=your-runware-api-key-here

# Security
SESSION_SECRET=super_secure_session_secret_minimum_32_characters_here_2024
EOF
fi

chmod 600 .env

# Container neu starten
echo "🐳 Starte Docker Container neu..."
docker compose down 2>/dev/null || true
docker compose build --no-cache
docker compose up -d

echo "⏳ Warte 30 Sekunden auf Container-Start..."
sleep 30

# Status prüfen
echo "📊 Container Status:"
docker compose ps

echo "🌐 Test der Anwendung..."
if curl -f -s http://localhost > /dev/null 2>&1; then
    echo "✅ Anwendung läuft erfolgreich!"
    echo "🌐 Erreichbar unter: http://$(hostname -I | awk '{print $1}')"
else
    echo "⚠️  Anwendung reagiert noch nicht, prüfen Sie die Logs:"
    echo "docker compose logs"
fi

echo ""
echo "🔑 WICHTIG: API-Schlüssel konfigurieren!"
echo "   nano .env"
echo "   docker compose restart"
echo ""
echo "✅ Git Repository Fix abgeschlossen!"