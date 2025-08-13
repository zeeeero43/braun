# Walter Braun Umzüge - Professional Moving Services Website

Eine moderne, professionelle Website für Walter Braun Umzüge - Ihren zuverlässigen Umzugspartner in München und Umgebung.

![Walter Braun Umzüge](https://img.shields.io/badge/Status-Production%20Ready-green) ![Docker](https://img.shields.io/badge/Docker-Supported-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🚀 Schnellstart mit Docker

### Automatisches Deployment (Ubuntu 22.04)

```bash
# 1. Repository klonen
git clone https://github.com/IHR_USERNAME/walter-braun-umzuege.git
cd walter-braun-umzuege

# 2. Deployment Script ausführen
chmod +x deploy.sh
sudo ./deploy.sh https://github.com/IHR_USERNAME/walter-braun-umzuege.git

# 3. API-Schlüssel konfigurieren
nano .env
# DEEPSEEK_API_KEY und RUNWARE_API_KEY eintragen

# 4. Container neu starten
docker compose restart
```

### Manuelles Deployment

```bash
# Docker installieren (falls noch nicht vorhanden)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Projekt starten
docker compose up -d

# Logs überprüfen
docker compose logs -f
```

## 📋 Features

### 🎯 Kernfunktionen
- **Professionelle Umzugsdienstleistungen** - Privat-, Büro- und Fernumzüge
- **Kontaktformular** - Direkte Anfragen und Kostenvoranschläge
- **Responsive Design** - Optimiert für alle Geräte
- **SEO-optimiert** - Bessere Sichtbarkeit in Suchmaschinen

### 🤖 AI-Powered Blog System
- **Automatische Content-Generierung** mit DeepSeek AI
- **KI-generierte Bilder** über Runware API
- **München-spezifische Themen** und lokaler Bezug
- **Umfangreiche FAQ-Bereiche** für bessere Suchmaschinenoptimierung

### 🏢 Authentische Darstellung
- **16 echte Firmenfotos** statt Stock-Images
- **Professionelle Zertifizierungen** (CHECK24, ImmoScout24, BGL, AMÖ)
- **Lokaler München-Bezug** in Design und Content
- **Vertrauenswürdige Kundenbewertungen**

## 🛠 Technischer Stack

### Frontend
- **React 18** mit TypeScript
- **Tailwind CSS** für responsive Design
- **Shadcn/UI** Komponentenbibliothek
- **TanStack Query** für Server State Management
- **Wouter** für Routing

### Backend
- **Node.js** mit Express.js
- **PostgreSQL** Datenbank mit Drizzle ORM
- **TypeScript** für typsichere Entwicklung
- **Zod** für Validierung

### AI Integration
- **DeepSeek API** für Content-Generierung
- **Runware API** für Bildgenerierung
- **Automatische Blog-Publikation** alle 3-4 Tage

### Deployment
- **Docker** Multi-Container Setup
- **Nginx** Reverse Proxy mit SSL-Unterstützung
- **PostgreSQL 15** mit persistenten Volumes
- **Health Checks** und automatische Neustarts

## 🔧 Konfiguration

### Umgebungsvariablen (.env)

```bash
# Database
POSTGRES_PASSWORD=ihr_sicheres_passwort

# AI APIs
DEEPSEEK_API_KEY=sk-ihre-deepseek-api-key
RUNWARE_API_KEY=ihre-runware-api-key

# Security
SESSION_SECRET=ihr_super_sicherer_session_secret
```

### Docker Services

- **Web Application**: Port 5000 (intern) → 80/443 (extern)
- **PostgreSQL**: Port 5432 (intern)
- **Nginx**: Port 8080 (Reverse Proxy)

## 📱 Mobile Optimierung

Die Website ist vollständig für mobile Geräte optimiert:
- **Responsive Layout** für alle Bildschirmgrößen
- **Touch-optimierte Navigation**
- **Schnelle Ladezeiten** durch optimierte Bilder
- **Mobile-first Design-Ansatz**

## 🔒 Sicherheit

- **Firewall-Konfiguration** nur für notwendige Ports
- **SSL/TLS-Verschlüsselung** für HTTPS
- **Rate Limiting** zum Schutz vor Missbrauch
- **Security Headers** in Nginx-Konfiguration
- **Regelmäßige Backups** der PostgreSQL-Datenbank

## 📊 Monitoring & Wartung

### Container Management
```bash
# Status prüfen
docker compose ps

# Logs anzeigen
docker compose logs -f web

# Container neu starten
docker compose restart

# Updates deployen
git pull && docker compose build --no-cache && docker compose up -d
```

### Backup & Restore
```bash
# Datenbank Backup
docker compose exec postgres pg_dump -U postgres walter_braun_umzuege > backup.sql

# Backup wiederherstellen
cat backup.sql | docker compose exec -T postgres psql -U postgres walter_braun_umzuege
```

## 🏗 Projektstruktur

```
walter-braun-umzuege/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Komponenten
│   │   ├── pages/         # Seiten
│   │   └── lib/           # Utilities
├── server/                # Express Backend
│   ├── routes/           # API Routes
│   └── storage/          # Datenbank Layer
├── shared/               # Geteilte Typen/Schemas
├── docker-compose.yml    # Container Orchestrierung
├── Dockerfile           # Container Build
├── nginx.conf          # Reverse Proxy Config
└── deploy.sh          # Deployment Script
```

## 📈 Performance

- **Multi-stage Docker Builds** für kleinere Container
- **Nginx Caching** für statische Assets
- **Gzip Compression** für schnellere Übertragung
- **Database Indexing** für optimierte Queries
- **Image Optimization** für mobile Geräte

## 🌐 Deployment URLs

Nach erfolgreichem Deployment:
- **Hauptanwendung**: `http://ihre-domain.de`
- **Nginx Proxy**: `http://ihre-domain.de:8080`
- **Health Check**: `http://ihre-domain.de/health`

## 📞 Support

Bei Fragen oder Problemen:
1. Container-Logs überprüfen: `docker compose logs`
2. API-Schlüssel validieren
3. Firewall-Einstellungen prüfen
4. Deployment-Guide konsultieren: `DEPLOYMENT_GUIDE.md`

## 📄 Lizenz

Dieses Projekt ist für Walter Braun Umzüge entwickelt und steht unter proprietärer Lizenz.

---

**Walter Braun Umzüge** - Ihr zuverlässiger Partner für professionelle Umzüge in München und Umgebung.

📞 +49800 67 63 755 | 📱 +49 174 3861652