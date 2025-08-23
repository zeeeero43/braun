# Domain DNS Setup für walterbraun-muenchen.de

## Status
✅ Website läuft erfolgreich unter IP: http://217.154.205.93/
❌ Domain walterbraun-muenchen.de nicht erreichbar (DNS-Problem)

## DNS-Konfiguration erforderlich

### 1. Bei Ihrem Domain-Provider (z.B. Strato, 1&1, etc.)
Loggen Sie sich in Ihr Domain-Panel ein und setzen Sie diese DNS-Einträge:

**A-Record:**
- Name: `@` (oder leer lassen)
- Typ: `A`
- Wert: `217.154.205.93`
- TTL: `3600` (1 Stunde)

**CNAME-Record (optional):**
- Name: `www`
- Typ: `CNAME`
- Wert: `walterbraun-muenchen.de`
- TTL: `3600`

### 2. DNS-Propagation prüfen
Nach der Konfiguration dauert es 15 Minuten bis 24 Stunden bis die Domain funktioniert.

### 3. Test-Befehle
```bash
# DNS-Auflösung testen
nslookup walterbraun-muenchen.de
dig walterbraun-muenchen.de

# Domain-Erreichbarkeit testen  
curl -I http://walterbraun-muenchen.de
```

### 4. SSL-Zertifikat (später)
Sobald die Domain funktioniert, können Sie Let's Encrypt SSL einrichten:
```bash
# SSL-Setup Script ausführen (später)
./vps-domain-ssl-setup-fixed.sh
```

## Zusammenfassung
- ✅ VPS und Container funktionieren perfekt
- ✅ ERR_SSL_PROTOCOL_ERROR behoben
- 🔄 DNS-Konfiguration beim Domain-Provider erforderlich
- ⏳ Nach DNS-Setup: SSL-Zertifikat einrichten