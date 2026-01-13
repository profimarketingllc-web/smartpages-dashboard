# 🧭 SmartPages Dashboard

**Version:** v1.6  
**Stand:** Januar 2026  
**Status:** Production Stable

---

## 🚀 Übersicht

Das **SmartPages Dashboard** ist eine Cloudflare-Astro-Anwendung mit einem zentralisierten API-Gateway (Core Worker v7.6).  
Alle API-Aufrufe, Authentifizierungen und Datentransfers laufen über den zentralen SmartCore Worker (`api.smartpages.online`).  
Das System wurde so umgebaut, dass sämtliche Endpunkte, Services und Authentifizierungen zentral über den Core verwaltet werden.

---

## 🧱 Architekturübersicht

```
Frontend (Astro + Tailwind + SolidJS)
        ↓
API Layer (src/api/*)
        ↓
Core Worker (SmartCore v7.6)
        ↓
Cloudflare D1 (CORE_DB, AUTH_DB)
        ↓
Cloudflare KV (SESSION, STAGING)
```

### 🔧 Systemstruktur

| Ebene | Beschreibung |
|--------|---------------|
| **Frontend (Astro)** | Präsentationsebene mit Sprachumschaltung, Dashboard und Benutzeroberfläche |
| **API Layer** | Leitet alle API-Aufrufe an den Core Worker weiter |
| **Core Worker** | Zentrale Logik für Authentifizierung, Sessionmanagement, Mail- und Customer-Proxy |
| **KV / D1** | Persistente Speicherung von Sitzungen, Tokens, Logs und temporären Auth-Daten |

---

## ⚙️ API-Endpunkte & Hauptkomponenten

| Route / Datei | Methode | Beschreibung |
|----------------|----------|---------------|
| `/api/auth/start` | POST | Erstellt Magic Link und sendet Login-Mail |
| `/api/auth/verify` | GET | Prüft Token und legt diesen temporär in Staging-KV ab |
| `/api/auth/confirm` | GET | Erstellt Session aus Staging-Eintrag und löscht diesen anschließend |
| `/api/auth/logout` | GET | Beendet Session und entfernt Cookie |
| `/api/session/check` | GET | Prüft aktiven Loginstatus |
| `/api/customer/profile` | GET | Kundendaten abrufen über Core Worker |
| `/api/customer/imprint` | GET | Abruf von Impressumsdaten |
| `/src/api/verify.ts` | - | Verifiziert bestehende Sessions über Core Worker |
| `/src/middleware/lang.ts` | - | Sprachsteuerung (DE/EN) |
| `/src/utils/i18n.ts` | - | Dynamische Übersetzungen und Mehrsprachigkeit |
| `/src/pages/dashboard.astro` | GET | Haupt-Dashboard mit Kunden- und Impressumsdaten |

**Branches:**  
- `main` → Production Deployment (Cloudflare Pages)  
- `dev` → Entwicklungsumgebung mit Staging-Daten  

---

## 🔐 Authentifizierungsablauf (Magic-Link)

| Schritt | Endpoint | Beschreibung |
|----------|-----------|---------------|
| 1️⃣ | `/api/auth/start` | Token generieren und E-Mail versenden |
| 2️⃣ | `/api/auth/verify` | Token prüfen und temporär speichern |
| 3️⃣ | `/api/auth/confirm` | Session erstellen, Staging-Eintrag löschen |
| 4️⃣ | `/api/auth/logout` | Session und Cookie löschen |
| 5️⃣ | `/api/session/check` | Loginstatus abfragen |

### 🔁 Weiterleitung
Nach erfolgreicher Authentifizierung erfolgt die automatische Weiterleitung zum Dashboard:  
`https://desk.smartpages.online/{lang}/dashboard`

---

## 🗄 Datenbindungen

| Binding | Beschreibung | Typ |
|----------|---------------|------|
| `CORE_DB` | Zentrale Datenbank (Tokens, Logs, Templates) | Cloudflare D1 |
| `AUTH_DB` | Authentifizierungs-Backup | Cloudflare D1 |
| `SESSION` | Aktive Benutzer-Sessions | Cloudflare KV |
| `STAGING` | Temporäre Tokens (Verifizierungs-Übergabe) | Cloudflare KV |
| `MAILER` | Service-Binding für E-Mail-Versand | Cloudflare Service |
| `CUSTOMER` | Service-Binding für Kundendaten | Cloudflare Service |

---

## 🧩 Frontend-Komponenten

- **CustomerCard:** Zeigt Kundendaten und Statusinformationen  
- **ImprintCard:** Dynamische Anzeige der Impressumsdaten  
- **SystemMessage:** Zeigt Status- und Systemmeldungen direkt aus Core Worker Responses (Erfolg, Fehler, Warnung, Systemstatus)  
- **ProductGrid / ProductCard:** Übersichtliche Darstellung der Hauptfunktionen im Dashboard  
- **LangSwitcher:** Sprachumschaltung mit synchronisiertem Cookie und Header  

---

## 🧪 Deployment & Monitoring

| Umgebung | Zweck | Besonderheiten |
|-----------|--------|----------------|
| **Development** | Testumgebung mit simulierten Sessions | Verwendung von Staging-KV |
| **Production** | Live-System | Alle Bindings aktiv |
| **Core Worker** | API Gateway für Authentifizierung, Mail, Customer und Session | Deployment über Cloudflare Dashboard |

### 💾 Build & Deployment
```bash
npm run build
npx astro build
```
Cloudflare Pages erkennt automatisch API und Middleware (v2 Pages Routing).

---

## 🧠 Monitoring & Debugging

- Healthcheck: `/ping`  
- Logging über `console.log`, `warn`, `error`  
- Sessionprüfung: `/api/session/check`  
- Token-Test: `/api/auth/start`  

---

## 🗳 Lizenz & Hosting

- © 2026 Profi Marketing  
- Hosting über Cloudflare Pages + Workers  
- DSGVO-konform (EU-Datenhaltung)  
- Keine externen Tracker  

---

### ✅ To-Do / Nächste Schritte
- [ ] Verify-/Confirm-Flow finalisieren  
- [ ] Middleware komplett mit Session-KV verbinden  
- [ ] Inline-Routenpflege im Core Worker abschließen  
- [ ] Testautomatisierung für Mailer- und Customer-Proxy implementieren
