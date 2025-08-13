#!/bin/bash

# Walter Braun Umzüge - Vollständiges Git-basiertes Deployment Script für Ubuntu 22.04
# Dieses Script automatisiert die komplette Installation von Git Repository bis laufende Anwendung

set -e  # Exit bei Fehlern

echo "🚀 Walter Braun Umzüge - Vollständiges Git-Docker Deployment wird gestartet..."

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

# System Updates und Git Installation
update_system() {
    print_status "System wird aktualisiert und Git installiert..."
    apt update && apt upgrade -y
    apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release tree htop nano

    # Git Version prüfen
    git --version
    print_status "Git erfolgreich installiert: $(git --version)"
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

# Git Repository klonen und validieren
clone_repository() {
    local project_dir="/opt/walter-braun-umzuege"
    local repo_url="$1"
    
    print_status "Projekt wird von Git Repository geklont: $project_dir"
    
    # Altes Verzeichnis entfernen falls vorhanden
    if [[ -d "$project_dir" ]]; then
        print_warning "Verzeichnis $project_dir existiert bereits. Wird überschrieben..."
        rm -rf "$project_dir"
    fi
    
    # Verzeichnis erstellen und wechseln
    mkdir -p "$project_dir"
    cd "$project_dir"
    
    # Repository klonen
    if [[ -n "$repo_url" ]]; then
        print_status "Klone Repository: $repo_url"
        
        # Git Clone mit Fehlerbehandlung
        if ! git clone "$repo_url" .; then
            print_error "Git Clone fehlgeschlagen! Überprüfen Sie die Repository URL."
            print_status "Repository URL: $repo_url"
            exit 1
        fi
        
        # Repository Inhalt prüfen
        print_status "Repository Inhalt:"
        ls -la
        
        # Wichtige Dateien prüfen
        local required_files=("docker-compose.yml" "Dockerfile" "package.json")
        for file in "${required_files[@]}"; do
            if [[ ! -f "$file" ]]; then
                print_error "Wichtige Datei fehlt: $file"
                exit 1
            else
                print_status "✓ $file gefunden"
            fi
        done
        
    else
        print_error "Keine Repository URL angegeben!"
        print_status "Verwendung: $0 <repository-url>"
        print_status "Beispiel: $0 https://github.com/zeeeero43/braun.git"
        exit 1
    fi
    
    # Berechtigungen setzen
    if [[ $EUID -eq 0 ]]; then
        chown -R 1000:1000 "$project_dir"
    fi
    
    # Erforderliche Verzeichnisse erstellen
    mkdir -p uploads logs ssl init-db
    chmod 755 uploads logs
    chmod 700 ssl
    
    print_status "Repository erfolgreich geklont und validiert"
}

# Environment Datei erstellen oder von Template kopieren
create_env_file() {
    print_status "Environment Datei wird erstellt..."
    
    # Prüfen ob .env.template existiert
    if [[ -f ".env.template" ]]; then
        print_status "Verwende .env.template aus Repository"
        cp .env.template .env
    else
        print_status "Erstelle Standard .env Datei"
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
    fi
    
    chmod 600 .env
    print_warning "WICHTIG: Bearbeiten Sie die .env Datei und setzen Sie Ihre echten API-Schlüssel ein!"
    print_warning "Dateipfad: $(pwd)/.env"
    print_status "Verwenden Sie: nano .env"
}

# Node.js Dependencies installieren (falls nötig)
install_node_dependencies() {
    print_status "Node.js Dependencies werden überprüft..."
    
    # Prüfen ob node_modules existiert
    if [[ ! -d "node_modules" ]]; then
        if command -v npm >/dev/null 2>&1; then
            print_status "NPM gefunden, installiere Dependencies..."
            npm install
        else
            print_status "NPM nicht gefunden, Dependencies werden im Docker Container installiert"
        fi
    else
        print_status "node_modules bereits vorhanden"
    fi
}

# Docker Container bauen und starten
build_and_start_containers() {
    print_status "Docker Container werden gebaut und gestartet..."
    
    # Docker Compose Version prüfen
    docker compose version
    
    # Container stoppen falls bereits laufend
    print_status "Stoppe eventuell laufende Container..."
    docker compose down 2>/dev/null || true
    
    # Images neu bauen und Container starten
    print_status "Baue Docker Images..."
    docker compose build --no-cache
    
    print_status "Starte Container..."
    docker compose up -d
    
    # Warten bis Container bereit sind
    print_status "Warte auf Container-Startup (45 Sekunden)..."
    for i in {1..45}; do
        echo -n "."
        sleep 1
    done
    echo ""
    
    # Status prüfen
    print_status "Container Status:"
    docker compose ps
    
    # Logs kurz anzeigen
    print_status "Container Logs (letzte 20 Zeilen):"
    docker compose logs --tail=20
}

# Umfassende Anwendung testen
test_application() {
    print_status "Anwendung wird umfassend getestet..."
    
    local server_ip=$(hostname -I | awk '{print $1}')
    
    # Warten bis Server wirklich bereit ist
    print_status "Warte bis Server vollständig gestartet ist..."
    sleep 20
    
    # Port-Tests
    print_status "Teste offene Ports..."
    if netstat -tlnp | grep -q ":80 "; then
        print_status "✅ Port 80 ist offen"
    else
        print_warning "⚠️  Port 80 nicht erreichbar"
    fi
    
    # Gesundheitscheck mit mehreren Versuchen
    print_status "Teste Gesundheitscheck..."
    local health_success=false
    for i in {1..5}; do
        if curl -f -s http://localhost/health > /dev/null 2>&1; then
            print_status "✅ Gesundheitscheck erfolgreich (Versuch $i)"
            health_success=true
            break
        else
            print_warning "⚠️  Gesundheitscheck Versuch $i fehlgeschlagen, warte 10 Sekunden..."
            sleep 10
        fi
    done
    
    # Hauptseite testen
    print_status "Teste Hauptseite..."
    if curl -f -s http://localhost > /dev/null 2>&1; then
        print_status "✅ Hauptseite erreichbar"
    else
        print_warning "⚠️  Hauptseite nicht erreichbar"
    fi
    
    # API Test
    print_status "Teste API Endpunkt..."
    if curl -f -s http://localhost/api/blog > /dev/null 2>&1; then
        print_status "✅ API Test erfolgreich"
    else
        print_warning "⚠️  API Test fehlgeschlagen (möglicherweise noch keine Blog-Posts vorhanden)"
    fi
    
    # Ausgabe der URLs
    print_status "🌐 Ihre Anwendung ist erreichbar unter:"
    print_status "   💻 Hauptseite: http://$server_ip"
    print_status "   🏥 Health Check: http://$server_ip/health"
    print_status "   📝 Blog: http://$server_ip/blog"
    print_status "   🔧 Nginx Proxy: http://$server_ip:8080"
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
    
    # Docker-Dateien validieren
    if [[ -f "docker-compose.yml" && -f "Dockerfile" ]]; then
        install_node_dependencies
        build_and_start_containers
        test_application
        create_monitoring
        
        print_status "🎉 DEPLOYMENT ERFOLGREICH ABGESCHLOSSEN!"
        print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        print_status "🌐 Ihre Walter Braun Umzüge Website läuft jetzt auf:"
        print_status "   📱 Hauptseite: http://$(hostname -I | awk '{print $1}')"
        print_status "   🔧 Nginx Proxy: http://$(hostname -I | awk '{print $1}'):8080"
        print_status "   🏥 Health Check: http://$(hostname -I | awk '{print $1}')/health"
        print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        print_warning "🔑 WICHTIG: API-Schlüssel konfigurieren!"
        print_warning "   1. nano /opt/walter-braun-umzuege/.env"
        print_warning "   2. DEEPSEEK_API_KEY und RUNWARE_API_KEY eintragen"
        print_warning "   3. docker compose restart"
        print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        print_status "📊 Nützliche Befehle:"
        print_status "   docker compose logs -f    # Live Logs anzeigen"
        print_status "   docker compose ps          # Container Status"
        print_status "   docker compose restart     # Container neu starten"
        print_status "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
    else
        print_error "Docker-Dateien nicht gefunden!"
        print_error "Stellen Sie sicher, dass das Repository docker-compose.yml und Dockerfile enthält."
        print_status "Gefundene Dateien:"
        ls -la
        exit 1
    fi
}

# Script ausführen
main "$@"