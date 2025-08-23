# Deployment Scripts Übersicht

## Hauptscripts

### Update & Maintenance
- **git-safe-update.sh** - SSL-bewusste Git-Updates (empfohlen)
- **test-update-script.sh** - Update-Script testen ohne Ausführung
- **status-check.sh** - Schneller Gesundheitscheck

### SSL & HTTPS Management
- **restore-https.sh** - HTTPS-Konfiguration wiederherstellen
- **quick-ssl-restore.sh** - SSL-Zertifikate neu erstellen
- **simple-ssl-fix.sh** - Einfacher SSL-Status-Check

### Emergency & Recovery
- **emergency-recovery.sh** - Vollständige Systemwiederherstellung
- **emergency-diagnosis.sh** - Problemdiagnose
- **emergency-restart.sh** - Container-Neustart

## Empfohlene Nutzung

### Tägliche Wartung
```bash
./status-check.sh               # Status prüfen
./git-safe-update.sh           # Updates einspielen
```

### Bei Problemen
```bash
./emergency-diagnosis.sh        # Problem identifizieren
./emergency-recovery.sh         # System wiederherstellen
./quick-ssl-restore.sh          # SSL reparieren
```

### Vor größeren Changes
```bash
./test-update-script.sh         # Update-Sicherheit testen
# Backup erstellen in backups/
```

## Script-Status

| Script | Status | Zweck |
|--------|--------|--------|
| git-safe-update.sh | ✅ Überarbeitet | SSL-bewusste Updates |
| restore-https.sh | ✅ Funktional | HTTPS wiederherstellen |
| emergency-recovery.sh | ✅ Funktional | Vollständige Wiederherstellung |
| status-check.sh | ✅ Neu | Schnelle Statusprüfung |
| test-update-script.sh | ✅ Neu | Update-Test ohne Risiko |

## Sicherheitsfeatures

- Automatische Backup-Erstellung vor Updates
- SSL-Konfiguration-Schutz
- Rollback-Mechanismen
- Container-Gesundheitsprüfungen
- Git-Stash-Management