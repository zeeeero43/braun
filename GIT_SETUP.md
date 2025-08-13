# Git Repository Setup für Walter Braun Umzüge

## 📋 Git Repository Erstellen

### 1. GitHub Repository erstellen

1. Gehen Sie zu [GitHub.com](https://github.com)
2. Klicken Sie auf "New Repository"
3. Repository Name: `walter-braun-umzuege`
4. Beschreibung: `Professional moving services website for Walter Braun Umzüge`
5. **Public** Repository (für einfachen Zugriff)
6. **README.md** hinzufügen
7. **.gitignore** für Node.js wählen

### 2. Lokales Repository vorbereiten

```bash
# In Ihrem Replit Projekt
git init
git remote add origin https://github.com/IHR_USERNAME/walter-braun-umzuege.git

# Alle Dateien hinzufügen (außer .env und node_modules)
git add .
git commit -m "Initial commit: Walter Braun Umzüge website with Docker deployment"

# Zum GitHub Repository pushen
git branch -M main
git push -u origin main
```

### 3. Repository Struktur

Folgende Dateien werden ins Repository aufgenommen:
```
walter-braun-umzuege/
├── .gitignore              # Ignoriert .env, node_modules, logs, etc.
├── README.md               # Projekt-Dokumentation
├── DEPLOYMENT_GUIDE.md     # Detaillierte Deployment-Anleitung
├── README-DOCKER.md        # Docker-spezifische Anleitung
├── GIT_SETUP.md           # Diese Datei
├── Dockerfile             # Container-Definition
├── docker-compose.yml     # Multi-Container Setup
├── nginx.conf            # Reverse Proxy Konfiguration
├── deploy.sh            # Automatisches Deployment Script
├── package.json         # Node.js Dependencies
├── client/              # Frontend Code
├── server/              # Backend Code
├── shared/              # Geteilte Typen
└── init-db/            # Database Initialization
```

## 🚀 VPS Deployment mit Git

### Einfacher One-Liner für frisches Ubuntu 22.04:

```bash
# Als root oder mit sudo - WICHTIG: raw.githubusercontent.com verwenden!
curl -fsSL https://raw.githubusercontent.com/IHR_USERNAME/walter-braun-umzuege/main/deploy.sh | sudo bash -s https://github.com/IHR_USERNAME/walter-braun-umzuege.git

# Für Ihr Repository:
curl -fsSL https://raw.githubusercontent.com/zeeeero43/braun/main/deploy.sh | sudo bash -s https://github.com/zeeeero43/braun.git
```

### Oder Schritt für Schritt:

```bash
# 1. System vorbereiten
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget

# 2. Docker installieren
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 3. Repository klonen
sudo mkdir -p /opt/walter-braun-umzuege
sudo chown $USER:$USER /opt/walter-braun-umzuege
cd /opt/walter-braun-umzuege
git clone https://github.com/IHR_USERNAME/walter-braun-umzuege.git .

# 4. Deployment Script ausführen
chmod +x deploy.sh
sudo ./deploy.sh

# 5. API-Schlüssel konfigurieren
nano .env
# DEEPSEEK_API_KEY und RUNWARE_API_KEY eintragen

# 6. Container starten
docker compose up -d
```

## 🔄 Updates deployen

```bash
cd /opt/walter-braun-umzuege
git pull origin main
docker compose build --no-cache
docker compose up -d
```

## 🔧 Git Workflow für Entwicklung

### Entwicklung in Replit:
```bash
# Änderungen committen
git add .
git commit -m "Beschreibung der Änderungen"
git push origin main
```

### Produktionsupdate auf VPS:
```bash
# Auf dem VPS
cd /opt/walter-braun-umzuege
git pull origin main
docker compose restart
```

## 📋 Environment-Template (.env.template)

Erstellen Sie eine `.env.template` Datei für das Repository:
```bash
# Database Configuration
POSTGRES_PASSWORD=ihr_sicheres_postgres_passwort

# AI API Keys - ERSETZEN SIE DIESE MIT IHREN ECHTEN SCHLÜSSELN
DEEPSEEK_API_KEY=sk-ihr-deepseek-api-key
RUNWARE_API_KEY=ihr-runware-api-key

# Security
SESSION_SECRET=ihr_super_sicherer_session_secret_minimum_32_zeichen

# Optional: Email Configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=ihre-email@gmail.com
# SMTP_PASS=ihr-app-passwort
```

## 🔒 Sicherheitshinweise

### Niemals ins Git Repository einchecken:
- `.env` Datei mit echten API-Schlüsseln
- `node_modules/` Verzeichnis
- SSL-Zertifikate
- Datenbank-Backups
- Log-Dateien

### Was ins Repository gehört:
- Quellcode
- Docker-Konfiguration
- Dokumentation
- `.env.template` (ohne echte Werte)
- Deployment-Scripts

## 📱 GitHub Repository Features

### Aktivieren Sie folgende GitHub Features:
- **Issues** für Bug-Tracking
- **Wiki** für erweiterte Dokumentation
- **Releases** für Versionierung
- **Actions** für CI/CD (optional)

### Repository Beschreibung:
```
🏠 Professional moving services website for Walter Braun Umzüge Munich
🐳 Docker-ready deployment with automated blog system
🎯 React + Node.js + PostgreSQL + AI integration
```

### Repository Topics:
`react` `nodejs` `docker` `typescript` `moving-services` `munich` `ai-blog` `postgresql`

## 🎯 Vorteile des Git-Deployments

✅ **Einfache Updates**: `git pull` und Container restart
✅ **Versionskontrolle**: Alle Änderungen nachverfolgbar
✅ **Backup**: Code ist in der Cloud gesichert
✅ **Kollaboration**: Mehrere Entwickler können mitarbeiten
✅ **Rollback**: Einfache Wiederherstellung alter Versionen
✅ **Automatisierung**: CI/CD Pipelines möglich

## 🏃‍♂️ Schnellstart-Kommandos

```bash
# Repository klonen und sofort deployen
git clone https://github.com/IHR_USERNAME/walter-braun-umzuege.git
cd walter-braun-umzuege
sudo ./deploy.sh
```

Das war's! Ihre Website läuft dann unter der VPS-IP-Adresse.

---

**Wichtig:** Vergessen Sie nicht, `IHR_USERNAME` durch Ihren echten GitHub-Benutzernamen zu ersetzen!