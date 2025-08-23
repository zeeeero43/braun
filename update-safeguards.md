# Update Safeguards für Walter Braun Website

## Problem-Übersicht
Das ursprüngliche `git-safe-update.sh` Script verursachte SSL-Zertifikat-Verlust und Konfigurationsprobleme.

## Neue Lösung: SSL-Aware Update Script

### Funktionen
- ✅ Erkennt automatisch SSL-Konfiguration (HTTPS vs HTTP)
- ✅ Sichert SSL-Zertifikate und nginx-Konfigurationen
- ✅ Stellt nach Git-Updates alle Konfigurationen wieder her
- ✅ Kompatibilitätsprüfung für docker-compose.yml
- ✅ Automatisches Rollback bei Fehlern
- ✅ Vollständige Status-Reports

### Scripts

1. **git-safe-update.sh** - Hauptupdate-Script (SSL-aware)
2. **restore-https.sh** - HTTPS-Konfiguration wiederherstellen
3. **quick-ssl-restore.sh** - SSL-Zertifikate neu erstellen
4. **test-update-script.sh** - Update-Script testen ohne Ausführung
5. **status-check.sh** - Schneller Gesundheitscheck

### Verwendung

**Normales Update:**
```bash
./git-safe-update.sh
```

**Bei SSL-Problemen:**
```bash
sudo ./quick-ssl-restore.sh
```

**Status prüfen:**
```bash
./status-check.sh
```

### Was passiert beim Update

1. **SSL-Erkennung**: Script erkennt automatisch HTTPS-Konfiguration
2. **Intelligente Backups**: Sichert SSL-Dateien, nginx-Configs, Daten
3. **Sichere Git-Updates**: Git pull mit automatischem Rollback
4. **Konfiguration-Wiederherstellung**: SSL/nginx-Configs nach Pull wiederherstellen
5. **Kompatibilitätsprüfung**: docker-compose.yml auf SSL-Support prüfen
6. **Container-Neustart**: Mit preserved Konfiguration
7. **Vollständiger Test**: HTTP/HTTPS Funktionalität prüfen

### Rollback-Optionen

Bei Problemen stehen mehrere Rollback-Optionen zur Verfügung:
- Git stash pop (nur Code)
- Vollständiges Backup wiederherstellen
- SSL-Konfiguration einzeln wiederherstellen

### Ergebnis
- ✅ HTTPS bleibt nach Updates erhalten
- ✅ Keine SSL-Zertifikat-Verluste mehr
- ✅ Automatische Konfiguration-Wiederherstellung
- ✅ Sichere Update-Strategie ohne Downtime