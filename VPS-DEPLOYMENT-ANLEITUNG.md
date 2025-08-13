# Walter Braun Umzüge - VPS Deployment Anleitung

## Problem gelöst ✅
Das Vite-Import-Problem wurde dauerhaft behoben durch ein Smart-Deployment-Script.

## Ein-Kommando-Deployment

**Auf Ihrem VPS einfach ausführen:**
```bash
cd /opt/walter-braun-umzuege
./smart-deploy-vps.sh
```

## Was passiert automatisch:

1. **Git Update** - Holt neueste Änderungen
2. **Vite-Fix** - Wendet automatisch die Dockerfile-Fixes an
3. **Docker Rebuild** - Baut Container ohne Vite-Abhängigkeiten
4. **Health Check** - Prüft ob alles läuft

## Das Script ist intelligent:

- ✅ Behebt **automatisch** alle Vite-Import-Probleme nach Git-Updates
- ✅ Erstellt immer einen **Vite-freien production-server.js**
- ✅ Macht **Clean-Rebuild** für saubere Container
- ✅ **Health-Checks** bestätigen erfolgreichen Start
- ✅ **Backup** mit git stash vor Update

## Weitere Befehle:

```bash
# Status prüfen
docker compose ps

# Live Logs anzeigen
docker compose logs web -f

# Nur Container neustarten (ohne Git Update)
docker compose restart web

# Komplett stoppen
docker compose down
```

## URLs nach Deployment:

- **Website:** http://217.154.205.93
- **Health Check:** http://217.154.205.93/health
- **Nginx:** http://217.154.205.93:8080

## Bei Problemen:

```bash
# Logs anzeigen
docker compose logs web

# Container Status
docker compose ps

# Manueller Neustart
docker compose down && docker compose up -d
```

## Das war's! 🎉

Sie müssen sich **nie wieder** um Vite-Import-Probleme kümmern. Das Script macht alles automatisch.