# Walter Braun Umzüge - Docker Deployment Guide

## Vollständige Anleitung für Ubuntu 22.04 VPS

### 1. VPS Vorbereitung

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Erforderliche Pakete installieren
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Firewall konfigurieren
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw --force enable
```

### 2. Docker Installation

```bash
# Docker GPG Schlüssel hinzufügen
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker Repository hinzufügen
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Paketliste aktualisieren und Docker installieren
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker ohne sudo verwenden
sudo usermod -aG docker $USER
newgrp docker

# Docker Service starten und aktivieren
sudo systemctl start docker
sudo systemctl enable docker

# Installation überprüfen
docker --version
docker compose version
```

### 3. Node.js Installation (für lokale Entwicklung, falls benötigt)

```bash
# NodeSource Repository hinzufügen
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js installieren
sudo apt install -y nodejs

# Versionen überprüfen
node --version
npm --version
```

### 4. Projekt Setup über Git (Empfohlen)

```bash
# Arbeitsverzeichnis erstellen
sudo mkdir -p /opt/walter-braun-umzuege
sudo chown $USER:$USER /opt/walter-braun-umzuege
cd /opt/walter-braun-umzuege

# Git Repository klonen
git clone https://github.com/IHR_USERNAME/walter-braun-umzuege.git .

# Oder direkt mit einem spezifischen Branch
git clone -b main https://github.com/IHR_USERNAME/walter-braun-umzuege.git .

# Repository Status prüfen
git status
git log --oneline -5
```

### 5. Umgebungsvariablen konfigurieren

```bash
# .env Datei erstellen
cat > .env << 'EOF'
# Database Configuration
POSTGRES_PASSWORD=IHR_SICHERES_POSTGRES_PASSWORT

# API Keys - ERSETZEN SIE DIESE MIT IHREN ECHTEN SCHLÜSSELN
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
RUNWARE_API_KEY=your-runware-api-key-here

# Security
SESSION_SECRET=IHR_SUPER_SICHERER_SESSION_SECRET_HIER_MINIMUM_32_ZEICHEN

# Optional: Email Configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=ihre-email@gmail.com
# SMTP_PASS=ihr-app-passwort
EOF

# Berechtigungen für .env Datei setzen
chmod 600 .env

# Beispiel mit echten Werten (ANPASSEN!)
# POSTGRES_PASSWORD=mYs3cur3P@ssw0rd2024!
# DEEPSEEK_API_KEY=sk-abcd1234efgh5678ijkl9012mnop3456
# RUNWARE_API_KEY=rw_1234567890abcdef1234567890abcdef
```

### 6. Verzeichnisse erstellen

```bash
# Erforderliche Verzeichnisse erstellen
mkdir -p uploads logs ssl init-db

# Berechtigungen setzen
chmod 755 uploads logs
chmod 700 ssl
```

### 7. SSL Zertifikate (optional aber empfohlen)

```bash
# Let's Encrypt installieren
sudo apt install -y snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Zertifikat erstellen (ersetzen Sie ihre-domain.de)
sudo certbot certonly --standalone -d ihre-domain.de -d www.ihre-domain.de

# Zertifikate kopieren
sudo cp /etc/letsencrypt/live/ihre-domain.de/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/ihre-domain.de/privkey.pem ./ssl/
sudo chown $USER:$USER ./ssl/*.pem
chmod 600 ./ssl/*.pem
```

### 8. Docker Container starten

```bash
# Container im Hintergrund starten
docker compose up -d

# Logs überprüfen
docker compose logs -f

# Status überprüfen
docker compose ps
```

### 9. Datenbank initialisieren

```bash
# Warten bis PostgreSQL bereit ist (ca. 30 Sekunden)
sleep 30

# Datenbank Migration ausführen (falls vorhanden)
docker compose exec web npm run db:migrate

# Oder manuell in die Datenbank verbinden
docker compose exec postgres psql -U postgres -d walter_braun_umzuege
```

### 10. Anwendung testen

```bash
# Gesundheitscheck
curl http://localhost/health
curl http://localhost:8080/health

# API testen
curl http://localhost/api/blog

# In Browser öffnen
# http://IHR_VPS_IP (direkter Zugriff auf die App)
# http://IHR_VPS_IP:8080 (über Nginx)
```

## Wartung und Monitoring

### Container verwalten

```bash
# Container stoppen
docker compose down

# Container neu starten
docker compose restart

# Container neu bauen
docker compose build --no-cache
docker compose up -d

# Logs anzeigen
docker compose logs web
docker compose logs postgres
docker compose logs nginx

# Container Status
docker compose ps
docker stats
```

### Backup

```bash
# Datenbank Backup erstellen
docker compose exec postgres pg_dump -U postgres walter_braun_umzuege > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup wiederherstellen
cat backup_file.sql | docker compose exec -T postgres psql -U postgres walter_braun_umzuege

# Vollständiges System Backup
tar -czf walter_braun_backup_$(date +%Y%m%d).tar.gz /opt/walter-braun-umzuege
```

### Monitoring Script erstellen

```bash
cat > monitor.sh << 'EOF'
#!/bin/bash
cd /opt/walter-braun-umzuege

# Überprüfen ob Container laufen
if ! docker compose ps | grep -q "Up"; then
    echo "Container nicht erreichbar - Neustart..."
    docker compose up -d
fi

# Gesundheitscheck
if ! curl -f http://localhost/health > /dev/null 2>&1; then
    echo "Anwendung nicht erreichbar - Neustart..."
    docker compose restart web
fi

# Festplattenspeicher überprüfen
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Warnung: Festplatte zu ${DISK_USAGE}% voll"
fi
EOF

chmod +x monitor.sh

# Cron Job für Monitoring (alle 5 Minuten)
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/walter-braun-umzuege/monitor.sh >> /var/log/walter-braun-monitor.log 2>&1") | crontab -
```

### Updates deployen

```bash
# Neuen Code pullen
git pull origin main

# Container neu bauen und starten
docker compose build --no-cache
docker compose up -d
```

## Troubleshooting

### Häufige Probleme

1. **Port bereits in Verwendung**
   ```bash
   sudo lsof -i :80
   sudo lsof -i :5000
   sudo kill -9 PID_NUMBER
   ```

2. **Speicher voll**
   ```bash
   # Docker aufräumen
   docker system prune -a
   docker volume prune
   ```

3. **Datenbankverbindung fehlgeschlagen**
   ```bash
   # PostgreSQL Container Logs prüfen
   docker compose logs postgres
   
   # Manuell verbinden
   docker compose exec postgres psql -U postgres -d walter_braun_umzuege
   ```

4. **API Keys funktionieren nicht**
   ```bash
   # Umgebungsvariablen im Container prüfen
   docker compose exec web env | grep API
   ```

### Logs und Debugging

```bash
# Alle Logs anzeigen
docker compose logs

# Einzelne Services
docker compose logs web
docker compose logs postgres
docker compose logs nginx

# Live Logs verfolgen
docker compose logs -f web

# In Container einsteigen
docker compose exec web sh
docker compose exec postgres psql -U postgres -d walter_braun_umzuege
```

## Performance Optimierung

### Nginx Konfiguration anpassen

```bash
# Für höheren Traffic nginx.conf bearbeiten
nano nginx.conf

# Worker Prozesse erhöhen
worker_processes auto;

# Größere Puffer
client_body_buffer_size 16K;
client_header_buffer_size 1k;
large_client_header_buffers 2 1k;
```

### PostgreSQL Tuning

```bash
# PostgreSQL Konfiguration optimieren
docker compose exec postgres psql -U postgres -d walter_braun_umzuege -c "
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
SELECT pg_reload_conf();
"
```

## Sicherheit

### Firewall richtig konfigurieren

```bash
# Nur notwendige Ports öffnen
sudo ufw reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### SSL richtig einrichten

Bearbeiten Sie `nginx.conf` für SSL:

```bash
# SSL Konfiguration hinzufügen
server {
    listen 443 ssl http2;
    server_name ihre-domain.de;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Rest der Konfiguration...
}

# HTTP zu HTTPS umleiten
server {
    listen 80;
    server_name ihre-domain.de;
    return 301 https://$server_name$request_uri;
}
```

---

## Kontakt und Support

Bei Problemen oder Fragen zur Deployment:
- Überprüfen Sie die Logs: `docker compose logs`
- Stellen Sie sicher, dass alle API-Schlüssel korrekt sind
- Überprüfen Sie die Netzwerkverbindungen und Firewall-Einstellungen

**Wichtig:** Ersetzen Sie alle Platzhalter (API-Keys, Passwörter, Domain-Namen) mit Ihren echten Werten!