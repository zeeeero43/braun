#!/bin/bash

echo "=== VPS Port-Konflikt Lösung ==="

# Stop alle Docker Container
echo "Stoppe alle Docker Container..."
docker stop $(docker ps -q) 2>/dev/null || echo "Keine Container zu stoppen"

# Remove alle Container
echo "Entferne alle Container..."
docker rm $(docker ps -a -q) 2>/dev/null || echo "Keine Container zu entfernen"

# Prüfe welcher Prozess Port 80 verwendet
echo "Prüfe Port 80 Belegung:"
netstat -tlnp | grep :80 || lsof -i :80 || echo "Port 80 nicht belegt"

# Kill Prozesse auf Port 80 (außer systemd)
echo "Stoppe Prozesse auf Port 80..."
fuser -k 80/tcp 2>/dev/null || echo "Kein Prozess auf Port 80 zu stoppen"

# Prüfe ob Apache/Nginx läuft
echo "Prüfe Webserver..."
systemctl stop apache2 2>/dev/null || echo "Apache nicht aktiv"
systemctl stop nginx 2>/dev/null || echo "Nginx nicht aktiv"
systemctl stop lighttpd 2>/dev/null || echo "Lighttpd nicht aktiv"

# Alternative: Verwende Port 8080 falls 80 nicht freigegeben werden kann
echo "Verwende alternativen Port 8080..."

# Docker Compose mit Port 8080 starten
export WALTER_BRAUN_HTTP_PORT=8080

echo "Starte Walter Braun Container auf Port 8080..."
docker compose up -d --force-recreate

# Warte auf Container Start
sleep 10

# Status prüfen
echo "Container Status:"
docker compose ps

echo "Logs prüfen:"
docker compose logs --tail=20 web

echo "=== Fix abgeschlossen ==="
echo "Website sollte jetzt unter Port 8080 erreichbar sein"
echo "Testen Sie: http://ihre-domain.de:8080"