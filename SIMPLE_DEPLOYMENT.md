# Einfaches VPS Deployment - Walter Braun Umzüge

## 🚀 Schritt-für-Schritt ohne Git

### 1. System vorbereiten

```bash
# Als root einloggen
sudo su

# System aktualisieren
apt update && apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose installieren
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Firewall konfigurieren
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
```

### 2. Projekt-Verzeichnis erstellen

```bash
# Hauptverzeichnis erstellen
mkdir -p /opt/walter-braun-umzuege
cd /opt/walter-braun-umzuege

# Unterverzeichnisse erstellen
mkdir -p uploads logs ssl init-db client server shared
```

### 3. Alle Dateien manuell erstellen

Erstellen Sie alle Dateien einzeln mit `nano` oder laden Sie sie hoch:

#### docker-compose.yml
```bash
nano docker-compose.yml
```
Kopieren Sie den Inhalt aus der Replit-Datei

#### Dockerfile
```bash
nano Dockerfile
```
Kopieren Sie den Inhalt aus der Replit-Datei

#### nginx.conf
```bash
nano nginx.conf
```
Kopieren Sie den Inhalt aus der Replit-Datei

#### .env erstellen
```bash
nano .env
```
```
POSTGRES_PASSWORD=IhrSicheresPasswort123!
DEEPSEEK_API_KEY=sk-ihre-deepseek-api-key
RUNWARE_API_KEY=ihre-runware-api-key
SESSION_SECRET=ein_sehr_langer_sicherer_string_mindestens_32_zeichen
```

### 4. Alternative: Dateien per SCP hochladen

Von Ihrem lokalen Computer (wo Replit läuft):

```bash
# Alle Dateien auf einmal hochladen
scp -r ./* root@IHR_VPS_IP:/opt/walter-braun-umzuege/

# Oder einzelne wichtige Dateien
scp docker-compose.yml root@IHR_VPS_IP:/opt/walter-braun-umzuege/
scp Dockerfile root@IHR_VPS_IP:/opt/walter-braun-umzuege/
scp nginx.conf root@IHR_VPS_IP:/opt/walter-braun-umzuege/
scp -r client/ root@IHR_VPS_IP:/opt/walter-braun-umzuege/
scp -r server/ root@IHR_VPS_IP:/opt/walter-braun-umzuege/
scp -r shared/ root@IHR_VPS_IP:/opt/walter-braun-umzuege/
scp package.json root@IHR_VPS_IP:/opt/walter-braun-umzuege/
```

### 5. Container starten

```bash
cd /opt/walter-braun-umzuege

# Container bauen und starten
docker-compose up --build -d

# Status prüfen
docker-compose ps

# Logs anzeigen
docker-compose logs -f
```

### 6. Testen

```bash
# Gesundheitscheck
curl http://localhost/health

# Website aufrufen
curl http://IHR_VPS_IP
```

## 📋 Dateiliste (Minimum)

Diese Dateien müssen auf dem VPS vorhanden sein:

```
/opt/walter-braun-umzuege/
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── .env
├── package.json
├── client/
│   └── [alle Frontend-Dateien]
├── server/
│   └── [alle Backend-Dateien]
├── shared/
│   └── [geteilte Schemas]
└── init-db/
    └── init.sql
```

## 🔧 Troubleshooting

### Container starten nicht:
```bash
docker-compose logs
```

### Port-Konflikte:
```bash
lsof -i :80
lsof -i :5000
```

### Speicher-Probleme:
```bash
df -h
docker system prune
```

### Neubau nach Änderungen:
```bash
docker-compose down
docker-compose up --build -d
```

## 📱 Handy-Nummer Footer Problem

Das Problem mit der verschobenen Handynummer im Footer beheben wir separat im Code.
