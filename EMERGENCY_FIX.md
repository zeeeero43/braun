# Emergency Fix für Git Clone Problem

## Direkter manueller Fix auf Ihrem VPS:

```bash
# 1. Komplett neues Verzeichnis erstellen
rm -rf /opt/walter-braun-umzuege
mkdir -p /opt/walter-braun-umzuege
cd /opt/walter-braun-umzuege

# 2. Repository klonen
git clone https://github.com/zeeeero43/braun.git .

# 3. .env Datei erstellen
cat > .env << 'EOF'
# Database Configuration
POSTGRES_PASSWORD=WalterBraun_Secure_2024!

# API Keys - ERSETZEN SIE DIESE MIT IHREN ECHTEN SCHLÜSSELN
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
RUNWARE_API_KEY=your-runware-api-key-here

# Security
SESSION_SECRET=super_secure_session_secret_minimum_32_characters_here_2024
EOF

# 4. Container starten
docker compose down
docker compose build --no-cache
docker compose up -d

# 5. Status prüfen
sleep 30
docker compose ps
curl http://localhost
```

## Oder noch einfacher - Schritt für Schritt:

```bash
# Schritt 1: Altes Verzeichnis komplett entfernen
rm -rf /opt/walter-braun-umzuege

# Schritt 2: Neu erstellen und klonen
mkdir -p /opt/walter-braun-umzuege
cd /opt/walter-braun-umzuege
git clone https://github.com/zeeeero43/braun.git .

# Schritt 3: Wenn erfolgreich, dann Container starten
ls -la  # Prüfen ob Dateien da sind
docker compose up -d
```

Das sollte definitiv funktionieren!