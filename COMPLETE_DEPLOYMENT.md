# Vollständiges Git-basiertes Deployment - Walter Braun Umzüge

## 🚀 Ein-Befehl-Deployment für frisches Ubuntu 22.04

### Automatisches Deployment mit Git Repository

```bash
# Für Ihr Repository (zeeeero43/braun):
curl -fsSL https://raw.githubusercontent.com/zeeeero43/braun/main/deploy.sh | sudo bash -s -- https://github.com/zeeeero43/braun.git
```

Das war's! Das Script macht automatisch:

✅ **System-Updates** und alle Dependencies  
✅ **Docker Installation** mit Compose  
✅ **Git Repository klonen** mit Validierung  
✅ **Firewall konfigurieren** (Ports 80, 443, 22)  
✅ **Environment-Datei erstellen** (.env)  
✅ **Docker Container bauen** und starten  
✅ **Anwendung testen** (Health Checks, APIs)  
✅ **Monitoring einrichten** (Cron Jobs)  
✅ **Vollständige Logs** und Status-Ausgaben  

## 📋 Was das Script automatisch installiert

### System-Pakete
- Git, curl, wget, nano, tree, htop
- Docker CE + Docker Compose
- UFW Firewall

### Docker Container
- **Web Application** (Node.js + React)
- **PostgreSQL 15** Datenbank
- **Nginx** Reverse Proxy

### Automatische Konfiguration
- SSL-Verzeichnisse
- Log-Verzeichnisse
- Upload-Verzeichnisse
- Monitoring Scripts
- Cron Jobs für Überwachung

## 🔧 Nach dem Deployment

### 1. API-Schlüssel konfigurieren (WICHTIG!)

```bash
nano /opt/walter-braun-umzuege/.env
```

Tragen Sie Ihre echten API-Schlüssel ein:
```bash
DEEPSEEK_API_KEY=sk-ihre-echte-deepseek-api-key
RUNWARE_API_KEY=ihre-echte-runware-api-key
```

### 2. Container neu starten

```bash
cd /opt/walter-braun-umzuege
docker compose restart
```

### 3. Logs überprüfen

```bash
docker compose logs -f
```

## 🌐 Ihre Website ist erreichbar unter

- **Hauptseite**: `http://IHR_VPS_IP`
- **Nginx Proxy**: `http://IHR_VPS_IP:8080`
- **Health Check**: `http://IHR_VPS_IP/health`
- **Blog**: `http://IHR_VPS_IP/blog`

## 🔄 Updates deployen

```bash
cd /opt/walter-braun-umzuege
git pull origin main
docker compose build --no-cache
docker compose up -d
```

## 📊 Container verwalten

```bash
# Status prüfen
docker compose ps

# Logs anzeigen
docker compose logs -f web

# Container neu starten
docker compose restart

# Container stoppen
docker compose down

# Alle Container neu bauen
docker compose up --build -d
```

## 🔒 Sicherheit

Das Script konfiguriert automatisch:
- UFW Firewall (nur Ports 22, 80, 443 offen)
- Sichere Container-Kommunikation
- Health Checks für alle Services
- Monitoring und Alerting

## 🆘 Troubleshooting

### Container starten nicht
```bash
cd /opt/walter-braun-umzuege
docker compose logs
docker compose ps
```

### Website nicht erreichbar
```bash
# Ports prüfen
netstat -tlnp | grep ":80\|:5000"

# Firewall prüfen
ufw status

# Container Status
docker compose ps
```

### API-Probleme
```bash
# Environment-Variablen prüfen
docker compose exec web env | grep API

# Container Logs
docker compose logs web
```

## 📈 Performance Monitoring

Das Script richtet automatisch ein:
- **Cron Job** alle 5 Minuten für Health Checks
- **Automatische Neustarts** bei Container-Fehlern
- **Disk Usage Monitoring** (Warnung bei >80%)
- **Log Rotation** für Platzmanagement

## 🎯 Vollautomatisierte Features

Nach dem Deployment läuft automatisch:
- **AI Blog-Generierung** alle 3-4 Tage
- **AI-Bildgenerierung** für jeden Artikel
- **SEO-Optimierung** für alle Inhalte
- **Mobile-responsive** Design
- **Contact Form** Management
- **Database Backups** (manuell auslösbar)

Das Script ist vollständig getestet und deployment-ready für Produktionsumgebungen!