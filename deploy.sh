#!/bin/bash

# Walter Braun Umzüge - Deployment Script für Ubuntu 22.04
# Dieses Script automatisiert die komplette Installation

set -e  # Exit bei Fehlern

echo "🚀 Walter Braun Umzüge - Docker Deployment wird gestartet..."

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funktion für farbigen Output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNUNG]${NC} $1"
}

print_error() {
    echo -e "${RED}[FEHLER]${NC} $1"
}

# Überprüfung ob als Root ausgeführt wird
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_warning "Script wird als Root ausgeführt. Das ist OK, aber nicht empfohlen."
    fi
}

# System Updates
update_system() {
    print_status "System wird aktualisiert..."
    apt update && apt upgrade -y
    apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
}

# Docker Installation
install_docker() {
    print_status "Docker wird installiert..."
    
    # Docker GPG Schlüssel hinzufügen
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Docker Repository hinzufügen
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Docker installieren
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Docker Service starten
    systemctl start docker
    systemctl enable docker
    
    # User zur Docker Gruppe hinzufügen (falls nicht Root)
    if [[ $EUID -ne 0 ]]; then
        usermod -aG docker $USER
        print_status "User $USER zur Docker Gruppe hinzugefügt. Bitte neu einloggen oder 'newgrp docker' ausführen."
    fi
}

# Firewall konfigurieren
setup_firewall() {
    print_status "Firewall wird konfiguriert..."
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 8080/tcp
    ufw --force enable
}

# Git Repository klonen
clone_repository() {
    local project_dir="/opt/walter-braun-umzuege"
    local repo_url="$1"
    
    print_status "Projekt wird von Git Repository geklont: $project_dir"
    
    # Verzeichnis erstellen und wechseln
    mkdir -p $project_dir
    cd $project_dir
    
    # Repository klonen
    if [[ -n "$repo_url" ]]; then
        print_status "Klone Repository: $repo_url"
        git clone "$repo_url" .
    else
        print_error "Keine Repository URL angegeben!"
        print_status "Bitte führen Sie manuell aus:"
        print_status "git clone https://github.com/IHR_USERNAME/walter-braun-umzuege.git ."
        exit 1
    fi
    
    # Berechtigungen setzen
    if [[ $EUID -eq 0 ]]; then
        chown -R 1000:1000 $project_dir
    fi
    
    # Erforderliche Verzeichnisse erstellen
    mkdir -p uploads logs ssl init-db
    chmod 755 uploads logs
    chmod 700 ssl
    
    print_status "Repository erfolgreich geklont"
}

# Environment Datei erstellen
create_env_file() {
    print_status "Environment Datei wird erstellt..."
    
    cat > .env << 'EOF'
# Database Configuration
POSTGRES_PASSWORD=WalterBraun_Secure_2024!

# API Keys - ERSETZEN SIE DIESE MIT IHREN ECHTEN SCHLÜSSELN
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
RUNWARE_API_KEY=your-runware-api-key-here

# Security
SESSION_SECRET=super_secure_session_secret_minimum_32_characters_here_2024

# Optional: Email Configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=ihre-email@gmail.com
# SMTP_PASS=ihr-app-passwort
EOF
    
    chmod 600 .env
    print_warning "WICHTIG: Bearbeiten Sie die .env Datei und setzen Sie Ihre echten API-Schlüssel ein!"
    print_warning "Dateipfad: $(pwd)/.env"
}

# Docker Container starten
start_containers() {
    print_status "Docker Container werden gestartet..."
    
    # Container starten
    docker compose up -d
    
    # Warten bis Container bereit sind
    print_status "Warte auf Container-Startup (30 Sekunden)..."
    sleep 30
    
    # Status prüfen
    docker compose ps
}

# Anwendung testen
test_application() {
    print_status "Anwendung wird getestet..."
    
    # Gesundheitscheck
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_status "✅ Gesundheitscheck erfolgreich"
    else
        print_warning "⚠️  Gesundheitscheck fehlgeschlagen"
    fi
    
    # API Test
    if curl -f http://localhost/api/blog > /dev/null 2>&1; then
        print_status "✅ API Test erfolgreich"
    else
        print_warning "⚠️  API Test fehlgeschlagen"
    fi
}

# Monitoring Script erstellen
create_monitoring() {
    print_status "Monitoring Script wird erstellt..."
    
    cat > monitor.sh << 'EOF'
#!/bin/bash
cd /opt/walter-braun-umzuege

# Container Status prüfen
if ! docker compose ps | grep -q "Up"; then
    echo "$(date): Container nicht erreichbar - Neustart..." >> /var/log/walter-braun-monitor.log
    docker compose up -d
fi

# Gesundheitscheck
if ! curl -f http://localhost/health > /dev/null 2>&1; then
    echo "$(date): Anwendung nicht erreichbar - Neustart..." >> /var/log/walter-braun-monitor.log
    docker compose restart web
fi

# Festplattenspeicher prüfen
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$(date): Warnung: Festplatte zu ${DISK_USAGE}% voll" >> /var/log/walter-braun-monitor.log
fi
EOF
    
    chmod +x monitor.sh
    
    # Cron Job hinzufügen
    (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/walter-braun-umzuege/monitor.sh") | crontab -
    print_status "Monitoring Cron Job wurde hinzugefügt (alle 5 Minuten)"
}

# Hauptfunktion
main() {
    local repo_url="$1"
    
    print_status "Walter Braun Umzüge Deployment wird gestartet..."
    
    # Repository URL prüfen
    if [[ -z "$repo_url" ]]; then
        print_error "Keine Repository URL angegeben!"
        print_status "Verwendung: $0 <repository-url>"
        print_status "Beispiel: $0 https://github.com/username/walter-braun-umzuege.git"
        exit 1
    fi
    
    check_root
    update_system
    install_docker
    setup_firewall
    clone_repository "$repo_url"
    create_env_file
    
    # Nur starten wenn Docker-Dateien vorhanden sind
    if [[ -f "docker-compose.yml" && -f "Dockerfile" ]]; then
        start_containers
        test_application
        create_monitoring
        
        print_status "🎉 Deployment erfolgreich abgeschlossen!"
        print_status "Ihre Anwendung läuft auf:"
        print_status "  - http://$(hostname -I | awk '{print $1}') (direkt)"
        print_status "  - http://$(hostname -I | awk '{print $1}'):8080 (über Nginx)"
        print_warning "VERGESSEN SIE NICHT: API-Schlüssel in der .env Datei zu aktualisieren!"
        
    else
        print_error "Docker-Dateien nicht gefunden. Stellen Sie sicher, dass docker-compose.yml und Dockerfile vorhanden sind."
        exit 1
    fi
}

# Script ausführen
main "$@"