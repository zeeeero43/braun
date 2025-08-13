#!/bin/bash

# Status Check Script für Walter Braun Umzüge
# Perfekte Diagnose aller Container und Services

set -e

PROJECT_DIR="/opt/walter-braun-umzuege"

echo "🔍 WALTER BRAUN UMZÜGE - VOLLSTÄNDIGE STATUS DIAGNOSE"
echo "═══════════════════════════════════════════════════════════════"

cd "$PROJECT_DIR" 2>/dev/null || {
    echo "❌ FEHLER: Projekt-Verzeichnis $PROJECT_DIR nicht gefunden!"
    echo "   Führen Sie zuerst das Deployment aus"
    exit 1
}

# Farbcodes für bessere Lesbarkeit
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    local status=$1
    local message=$2
    if [[ "$status" == "OK" ]]; then
        echo -e "✅ ${GREEN}$message${NC}"
    elif [[ "$status" == "WARN" ]]; then
        echo -e "⚠️  ${YELLOW}$message${NC}"
    else
        echo -e "❌ ${RED}$message${NC}"
    fi
}

# 1. DOCKER SYSTEM STATUS
echo -e "\n${BLUE}1. DOCKER SYSTEM STATUS${NC}"
echo "─────────────────────────────────────────────────────────"

if command -v docker >/dev/null 2>&1; then
    print_status "OK" "Docker installiert: $(docker --version)"
    if systemctl is-active docker >/dev/null 2>&1; then
        print_status "OK" "Docker Service läuft"
    else
        print_status "FAIL" "Docker Service läuft NICHT"
        echo "   Starten mit: systemctl start docker"
    fi
else
    print_status "FAIL" "Docker nicht installiert"
    exit 1
fi

if command -v docker compose >/dev/null 2>&1; then
    print_status "OK" "Docker Compose verfügbar"
else
    print_status "FAIL" "Docker Compose nicht verfügbar"
fi

# 2. CONTAINER STATUS
echo -e "\n${BLUE}2. CONTAINER STATUS${NC}"
echo "─────────────────────────────────────────────────────────"

CONTAINERS=$(docker compose ps --format "table {{.Name}}\t{{.State}}\t{{.Status}}" 2>/dev/null || echo "ERROR")

if [[ "$CONTAINERS" == "ERROR" ]]; then
    print_status "FAIL" "Docker Compose Konfiguration fehlerhaft"
    echo "   Prüfen Sie docker-compose.yml"
else
    echo "$CONTAINERS"
    echo ""
    
    # Detaillierte Container-Analyse
    DB_STATUS=$(docker compose ps postgres --format "{{.State}}" 2>/dev/null || echo "missing")
    WEB_STATUS=$(docker compose ps web --format "{{.State}}" 2>/dev/null || echo "missing")
    NGINX_STATUS=$(docker compose ps nginx --format "{{.State}}" 2>/dev/null || echo "missing")
    
    case "$DB_STATUS" in
        "running") print_status "OK" "PostgreSQL Container läuft" ;;
        "exited") print_status "FAIL" "PostgreSQL Container gestoppt" ;;
        "restarting") print_status "WARN" "PostgreSQL Container startet neu" ;;
        *) print_status "FAIL" "PostgreSQL Container fehlt oder Problem" ;;
    esac
    
    case "$WEB_STATUS" in
        "running") print_status "OK" "Web Container läuft" ;;
        "exited") print_status "FAIL" "Web Container gestoppt" ;;
        "restarting") print_status "WARN" "Web Container startet neu" ;;
        *) print_status "FAIL" "Web Container fehlt oder Problem" ;;
    esac
    
    case "$NGINX_STATUS" in
        "running") print_status "OK" "Nginx Container läuft" ;;
        "exited") print_status "WARN" "Nginx Container gestoppt (optional)" ;;
        "restarting") print_status "WARN" "Nginx Container startet neu" ;;
        *) print_status "WARN" "Nginx Container fehlt (optional)" ;;
    esac
fi

# 3. HEALTH CHECKS
echo -e "\n${BLUE}3. HEALTH CHECKS${NC}"
echo "─────────────────────────────────────────────────────────"

# Database Health
if docker compose exec postgres pg_isready -U postgres -d walter_braun_umzuege >/dev/null 2>&1; then
    print_status "OK" "PostgreSQL Database erreichbar"
else
    print_status "FAIL" "PostgreSQL Database nicht erreichbar"
    echo "   Diagnose: docker compose logs postgres --tail=10"
fi

# Web Health Check
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health 2>/dev/null || echo "000")
case "$HTTP_STATUS" in
    "200") print_status "OK" "Web Health Check erfolgreich (HTTP $HTTP_STATUS)" ;;
    "000") print_status "FAIL" "Web Service nicht erreichbar" ;;
    *) print_status "FAIL" "Web Health Check fehlgeschlagen (HTTP $HTTP_STATUS)" ;;
esac

# Main Page Check
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null || echo "000")
case "$MAIN_STATUS" in
    "200") print_status "OK" "Hauptseite erreichbar (HTTP $MAIN_STATUS)" ;;
    "000") print_status "FAIL" "Hauptseite nicht erreichbar" ;;
    *) print_status "WARN" "Hauptseite Problem (HTTP $MAIN_STATUS)" ;;
esac

# 4. PORT VERFÜGBARKEIT
echo -e "\n${BLUE}4. PORT VERFÜGBARKEIT${NC}"
echo "─────────────────────────────────────────────────────────"

check_port() {
    local port=$1
    local description=$2
    if netstat -tuln | grep ":$port " >/dev/null 2>&1; then
        print_status "OK" "Port $port ($description) offen"
    else
        print_status "FAIL" "Port $port ($description) nicht verfügbar"
    fi
}

check_port 80 "HTTP"
check_port 5000 "Web App"
check_port 5432 "PostgreSQL"
check_port 443 "HTTPS"

# 5. RESSOURCEN-VERBRAUCH
echo -e "\n${BLUE}5. RESSOURCEN-VERBRAUCH${NC}"
echo "─────────────────────────────────────────────────────────"

# Disk Space
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
if [[ $DISK_USAGE -lt 80 ]]; then
    print_status "OK" "Festplatte: $DISK_USAGE% belegt"
elif [[ $DISK_USAGE -lt 90 ]]; then
    print_status "WARN" "Festplatte: $DISK_USAGE% belegt (wird knapp)"
else
    print_status "FAIL" "Festplatte: $DISK_USAGE% belegt (kritisch)"
fi

# Memory
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", ($3/$2)*100}')
if [[ $MEM_USAGE -lt 80 ]]; then
    print_status "OK" "Arbeitsspeicher: $MEM_USAGE% belegt"
elif [[ $MEM_USAGE -lt 90 ]]; then
    print_status "WARN" "Arbeitsspeicher: $MEM_USAGE% belegt"
else
    print_status "FAIL" "Arbeitsspeicher: $MEM_USAGE% belegt (kritisch)"
fi

# Container Resources
if command -v docker >/dev/null 2>&1; then
    echo -e "\nContainer Ressourcen:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" 2>/dev/null || echo "Keine Container Statistiken verfügbar"
fi

# 6. LOGS ANALYSE
echo -e "\n${BLUE}6. AKTUELLE LOGS (LETZTE 10 ZEILEN)${NC}"
echo "─────────────────────────────────────────────────────────"

echo -e "\n${YELLOW}Web Container Logs:${NC}"
docker compose logs web --tail=10 2>/dev/null || echo "Keine Web Logs verfügbar"

echo -e "\n${YELLOW}PostgreSQL Logs:${NC}"
docker compose logs postgres --tail=5 2>/dev/null || echo "Keine PostgreSQL Logs verfügbar"

# 7. KONFIGURATIONSDATEIEN
echo -e "\n${BLUE}7. KONFIGURATIONSDATEIEN${NC}"
echo "─────────────────────────────────────────────────────────"

if [[ -f "docker-compose.yml" ]]; then
    print_status "OK" "docker-compose.yml vorhanden"
else
    print_status "FAIL" "docker-compose.yml fehlt"
fi

if [[ -f "Dockerfile" ]]; then
    print_status "OK" "Dockerfile vorhanden"
else
    print_status "FAIL" "Dockerfile fehlt"
fi

if [[ -f ".env" ]]; then
    print_status "OK" ".env Datei vorhanden"
    # Prüfe API Keys
    if grep -q "DEEPSEEK_API_KEY=sk-" .env 2>/dev/null; then
        print_status "OK" "DeepSeek API Key konfiguriert"
    else
        print_status "WARN" "DeepSeek API Key nicht konfiguriert"
    fi
    
    if grep -q "RUNWARE_API_KEY=" .env 2>/dev/null && ! grep -q "RUNWARE_API_KEY=$" .env; then
        print_status "OK" "Runware API Key konfiguriert"
    else
        print_status "WARN" "Runware API Key nicht konfiguriert"
    fi
else
    print_status "WARN" ".env Datei fehlt"
fi

# 8. FINALE BEWERTUNG & EMPFEHLUNGEN
echo -e "\n${BLUE}8. FINALE BEWERTUNG & EMPFEHLUNGEN${NC}"
echo "═══════════════════════════════════════════════════════════════"

# Berechne Overall Status
CRITICAL_ISSUES=0
WARNINGS=0

# Prüfe kritische Services
[[ "$DB_STATUS" != "running" ]] && ((CRITICAL_ISSUES++))
[[ "$WEB_STATUS" != "running" ]] && ((CRITICAL_ISSUES++))
[[ "$HTTP_STATUS" != "200" ]] && ((CRITICAL_ISSUES++))

# Prüfe Warnungen
[[ "$NGINX_STATUS" != "running" ]] && ((WARNINGS++))
[[ "$MAIN_STATUS" != "200" ]] && ((WARNINGS++))
[[ ! -f ".env" ]] && ((WARNINGS++))

if [[ $CRITICAL_ISSUES -eq 0 && $WARNINGS -eq 0 ]]; then
    echo -e "🎉 ${GREEN}PERFEKT! Walter Braun Umzüge läuft optimal${NC}"
    echo -e "🌐 Website: http://$(hostname -I | awk '{print $1}')"
    echo -e "🏥 Health: http://$(hostname -I | awk '{print $1}')/health"
elif [[ $CRITICAL_ISSUES -eq 0 ]]; then
    echo -e "✅ ${GREEN}GUT! System läuft mit kleinen Warnungen${NC}"
    echo -e "⚠️  $WARNINGS Warnung(en) - siehe oben für Details"
    echo -e "🌐 Website: http://$(hostname -I | awk '{print $1}')"
else
    echo -e "❌ ${RED}PROBLEME! $CRITICAL_ISSUES kritische Fehler${NC}"
    echo -e "🔧 EMPFOHLENE AKTIONEN:"
    
    if [[ "$DB_STATUS" != "running" ]]; then
        echo "   1. PostgreSQL reparieren: docker compose up -d postgres"
    fi
    
    if [[ "$WEB_STATUS" != "running" ]]; then
        echo "   2. Web Container neustarten: docker compose restart web"
    fi
    
    if [[ "$HTTP_STATUS" != "200" ]]; then
        echo "   3. Web Logs prüfen: docker compose logs web"
    fi
    
    echo "   4. Kompletter Neustart: docker compose down && docker compose up -d"
fi

echo ""
echo -e "${BLUE}NÜTZLICHE BEFEHLE:${NC}"
echo "   docker compose ps                 # Container Status"
echo "   docker compose logs web --follow  # Live Logs"
echo "   docker compose restart web        # Web Container neustarten"
echo "   docker compose down && docker compose up -d  # Kompletter Neustart"

echo ""
echo "Diagnose abgeschlossen am $(date)"