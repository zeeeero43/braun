# Walter Braun Umzüge - Docker Deployment

## Schnellstart für VPS Deployment

### Automatische Installation mit Git (Empfohlen)

1. **Git Repository erstellen und Code hochladen:**
   - Erstellen Sie ein öffentliches GitHub Repository
   - Laden Sie alle Dateien hoch (folgen Sie `GIT_SETUP.md`)

2. **One-Liner Deployment:**
   ```bash
   curl -fsSL https://raw.githubusercontent.com/IHR_USERNAME/walter-braun-umzuege/main/deploy.sh | sudo bash -s https://github.com/IHR_USERNAME/walter-braun-umzuege.git
   
   # Für Ihr Repository (zeeeero43/braun):
   curl -fsSL https://raw.githubusercontent.com/zeeeero43/braun/main/deploy.sh | sudo bash -s https://github.com/zeeeero43/braun.git
   ```

3. **Oder Schritt für Schritt:**
   ```bash
   git clone https://github.com/IHR_USERNAME/walter-braun-umzuege.git /opt/walter-braun-umzuege
   cd /opt/walter-braun-umzuege
   chmod +x deploy.sh
   sudo ./deploy.sh
   ```

3. **API-Schlüssel konfigurieren:**
   ```bash
   nano .env
   # Ersetzen Sie die Platzhalter mit echten API-Schlüsseln
   ```

4. **Container neu starten:**
   ```bash
   docker compose restart
   ```

### Manuelle Installation

Folgen Sie der detaillierten Anleitung in `DEPLOYMENT_GUIDE.md`

## Wichtige Dateien

- `Dockerfile` - Container-Definition
- `docker-compose.yml` - Multi-Container Setup
- `nginx.conf` - Reverse Proxy Konfiguration
- `.dockerignore` - Dateien die nicht in Container kopiert werden
- `deploy.sh` - Automatisches Deployment Script
- `DEPLOYMENT_GUIDE.md` - Detaillierte Anleitung

## Nach dem Deployment

### Container verwalten
```bash
# Status prüfen
docker compose ps

# Logs anzeigen
docker compose logs -f

# Container neu starten
docker compose restart

# Container stoppen
docker compose down

# Container mit neu gebauten Images starten
docker compose up --build -d
```

### Backup erstellen
```bash
# Datenbank Backup
docker compose exec postgres pg_dump -U postgres walter_braun_umzuege > backup.sql

# Vollständiges Backup
tar -czf walter-braun-backup.tar.gz /opt/walter-braun-umzuege
```

### Updates deployen
```bash
# Neuen Code hochladen und Container neu bauen
docker compose build --no-cache
docker compose up -d
```

## Troubleshooting

### Container Logs prüfen
```bash
docker compose logs web
docker compose logs postgres
docker compose logs nginx
```

### In Container einsteigen
```bash
docker compose exec web sh
docker compose exec postgres psql -U postgres -d walter_braun_umzuege
```

### Port-Konflikte
```bash
sudo lsof -i :80
sudo lsof -i :5000
```

### Docker aufräumen
```bash
docker system prune -a
docker volume prune
```

## Produktions-URLs

Nach erfolgreichem Deployment ist die Anwendung erreichbar unter:
- `http://IHR_VPS_IP` - Direkte Verbindung zur App
- `http://IHR_VPS_IP:8080` - Über Nginx Reverse Proxy

## Wichtige Sicherheitshinweise

1. **Ändern Sie alle Standard-Passwörter** in der `.env` Datei
2. **Konfigurieren Sie SSL/TLS** für Produktionsumgebungen
3. **Aktivieren Sie die Firewall** und öffnen nur notwendige Ports
4. **Erstellen Sie regelmäßige Backups**
5. **Überwachen Sie die Logs** auf verdächtige Aktivitäten

## Support

Bei Problemen:
1. Überprüfen Sie die Container-Logs
2. Stellen Sie sicher, dass alle API-Schlüssel korrekt sind
3. Prüfen Sie die Netzwerk-Konnektivität
4. Kontaktieren Sie den Support mit den Log-Ausgaben