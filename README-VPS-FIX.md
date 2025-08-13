# Walter Braun Umzüge - VPS Vite Import Fix

## Problem
Container zeigt Fehler: `Cannot find package 'vite' imported from /app/dist/index.js`

## Lösung
Die Dockerfile wurde aktualisiert um einen Vite-freien production-server.js zu verwenden.

## Auf VPS ausführen:

1. **Dateien zum VPS kopieren:**
```bash
scp Dockerfile vps-docker-fix.sh root@217.154.205.93:/opt/walter-braun-umzuege/
```

2. **Auf VPS einloggen:**
```bash
ssh root@217.154.205.93
cd /opt/walter-braun-umzuege
```

3. **Fix ausführen:**
```bash
chmod +x vps-docker-fix.sh
./vps-docker-fix.sh
```

## Was passiert:
- Container werden gestoppt
- Alte Images entfernt
- Neue Dockerfile mit production-server.js gebaut
- Container ohne Vite-Import gestartet

## Nach dem Fix:
- Website: http://217.154.205.93
- Health Check: http://217.154.205.93/health
- Status: `docker compose ps`
- Logs: `docker compose logs web -f`

## Dockerfile Änderungen:
- Neuer `production-server.js` ohne Vite-Imports
- Nur Runtime-Dependencies installiert  
- Fallback-HTML für fehlende Frontend-Files
- Korrekte Health-Checks und API-Endpoints