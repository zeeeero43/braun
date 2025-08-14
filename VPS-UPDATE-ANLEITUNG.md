# VPS Update Anleitung - Walter Braun Umzüge Blog System

## Schnelle Deployment-Option (Empfohlen)

### 1. Auf VPS einloggen und ins Projektverzeichnis wechseln
```bash
ssh root@[IHR-VPS-IP]
cd /opt/walter-braun-umzuege
```

### 2. Smart Deployment ausführen
```bash
# Das Smart-Deploy-Skript macht alles automatisch:
# - Git Pull der neuesten Änderungen
# - Docker Container neu starten
# - Blog-System mit PostgreSQL aktivieren
chmod +x smart-deploy-vps.sh
./smart-deploy-vps.sh
```

### 3. Status prüfen
```bash
# Container-Status prüfen
docker-compose ps

# Logs anschauen
docker-compose logs -f web

# Blog-System testen
curl http://localhost/api/blog/debug
```

## Alternative: Manuelles Deployment

Falls das Smart-Script Probleme hat:

### 1. Git Update
```bash
git pull origin main
```

### 2. Container neu starten
```bash
# Container stoppen
docker-compose down

# Container neu bauen und starten
docker-compose up -d --build

# Status prüfen
docker-compose logs -f web
```

### 3. Blog-System testen
```bash
# API-Endpunkt testen
curl http://localhost/api/blog/debug

# Manuelle Blog-Generierung auslösen
curl -X POST http://localhost/api/blog/generate
```

## Was ist neu im Update?

✅ **Blog-System komplett funktionsfähig**
- Automatische Artikel-Generierung mit DeepSeek AI
- Authentische Bilder mit Runware API
- PostgreSQL-Datenpersistierung
- Frontend Blog-Seiten unter /blog

✅ **Verbesserte VPS-Architektur** 
- Separate Development/Production Server-Konfiguration
- Behobene Vite-Import-Probleme
- Optimierte Docker-Container

## Troubleshooting

### Container startet nicht
```bash
# Logs prüfen
docker-compose logs web

# Container-Status
docker-compose ps
```

### Blog generiert keine Artikel
```bash
# API-Keys in .env prüfen (DEEPSEEK_API_KEY, RUNWARE_API_KEY)
# Manuelle Generierung testen
curl -X POST http://localhost/api/blog/generate
```

### Datenbank-Probleme
```bash
# PostgreSQL Container prüfen
docker-compose logs db

# Datenbank-Schema pushen
docker-compose exec web npm run db:push
```

## Erfolg bestätigen

Das Update ist erfolgreich, wenn:

1. ✅ Container laufen: `docker-compose ps` zeigt "Up"
2. ✅ Website erreichbar: `curl http://[VPS-IP]` antwortet
3. ✅ Blog-API funktioniert: `curl http://[VPS-IP]/api/blog` zeigt JSON
4. ✅ Blog-Seite lädt: Browser → `http://[VPS-IP]/blog`

**Bei Problemen:** Das Update wurde auf Replit getestet und funktioniert. Die Container sollten sich automatisch neu starten.