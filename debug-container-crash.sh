#!/bin/bash

echo "🔍 Container Crash Debugging"
echo "============================"

echo "1. Container Logs - Startup Fehler:"
docker compose logs web --tail=50

echo ""
echo "2. Was ist im Container verfügbar?"
echo "Dateien im Container /app Verzeichnis:"
docker compose exec web ls -la /app/ 2>/dev/null || echo "Container nicht erreichbar für exec"

echo ""
echo "3. Ist dist/server/index.js vorhanden?"
docker compose exec web ls -la /app/dist/server/ 2>/dev/null || echo "dist/server Verzeichnis nicht verfügbar"

echo ""
echo "4. Welche Node-Prozesse laufen?"
docker compose exec web ps aux 2>/dev/null || echo "Container ps nicht verfügbar"

echo ""
echo "5. Container Restart-Loop Check:"
RESTARTS=$(docker inspect walter_braun_web --format='{{.RestartCount}}' 2>/dev/null)
echo "Container Restart Count: $RESTARTS"

echo ""
echo "6. Container Exit Code:"
EXIT_CODE=$(docker inspect walter_braun_web --format='{{.State.ExitCode}}' 2>/dev/null)
echo "Last Exit Code: $EXIT_CODE"

echo "============================"