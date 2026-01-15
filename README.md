# SmartPages Plattform – README (Stand: Januar 2026)

## 🚀 Systemübersicht
SmartPages ist eine **SSR (Server-Side Rendering)** basierte, modulare Webplattform, die vollständig auf Cloudflare Workers läuft. Das System kombiniert schnelle Edge-Rendering-Technologie mit einer Microservice-Architektur, die alle Kernfunktionen – Authentifizierung, Kundendaten, Mailing und Dashboard – sicher und DSGVO-konform abbildet.

Ziel ist eine skalierbare, sichere Plattform, die unabhängig von zentralen Servern operiert und auf **interner Kommunikation über Cloudflare Service Bindings** basiert. Dadurch werden Latenzen reduziert und Sicherheitsrisiken minimiert.

---

## 🧠 Architektur (Version 1.8)

### 👨‍💻 Hauptkomponenten
| Komponente | Version | Beschreibung |
|-------------|----------|---------------|
| **Core Worker** | v8.5 | Zentrale Authentifizierungs- & Routing-Schicht. Erstellt Sessions, verwaltet Tokens, steuert die interne Kommunikation. |
| **Customer Worker** | v5.1 | Verwaltet Kundendaten (Profil, Impressum, Mediadaten) und kommuniziert intern mit dem Core Worker. Kein externer Zugriff. |
| **Mailer Worker** | v3.4 | Versand von Magic Links und System-E-Mails. Ansteuerung über Core Worker. |
| **Astro Frontend (desk.smartpages.online)** | v6.0 | SSR-basiertes Benutzerinterface (Login, Dashboard, Karten, Modals). Kommuniziert ausschließlich mit Core Worker. |
| **Middleware** | v5.0 | Schutzmechanismus für das Dashboard. Prüft Sessions, lässt Login und API-Pfade unverändert passieren. |

---

## ⚙️ Environment Setup (Bindings & Ressourcen)

### 🧩 Core Worker (`api.smartpages.online`)
| Typ | Name | Wert | Beschreibung |
|------|------|------|---------------|
| D1-Datenbank | AUTH_DB | smartpages_auth_eu | Speichert Magic-Link Tokens, Login-Historie |
| D1-Datenbank | CORE_DB | smartcore-db_eu | Zentrale Systemdatenbank |
| Dienstbindung | CUSTOMER | smart-customer | Interne Verbindung zum Customer Worker |
| Dienstbindung | MAILER | smartpages-mailer | Verbindung zum Mailer Worker |
| KV-Namespace | RLIMIT | RLIMIT | Rate Limit Management (z. B. Magic-Link Limits) |
| KV-Namespace | SESSION | SESSION | Benutzer-Sessions (12h TTL) |
| KV-Namespace | STAGING | smart-staging | Temporäre Token-Speicherung während Auth |
| Cookie Domain | COOKIE_DOMAIN | .smartpages.online | Cookie-Konfiguration |

### 🧩 Customer Worker (`internal.customer`)
| Typ | Name | Wert | Beschreibung |
|------|------|------|---------------|
| KV-Namespace | CACHE_PROFILES | CACHE_PROFILES | Cache für Kundenprofile |
| D1-Datenbank | CUSTOMER_DB | smartcore-db_eu | Kundendatenbank (Profil, Impressum) |
| R2-Bucket | R2_CLIENT_MEDIA | smartpages-media | Kunden-Medien (z. B. Logos, PDFs) |

---

## 🔐 Session & Security Design
- **Session TTL:** 12 Stunden
- **Staging TTL:** 60 Sekunden (Magic-Link-Verifizierung)
- **Cookies:** Secure, HttpOnly, SameSite=None
- **Auth-Flows:** Nur Core Worker darf Sessions erstellen
- **Interne Kommunikation:** ausschließlich über Service Bindings (kein externer Zugriff)
- **Login-Schutz:** Middleware verhindert unautorisierte Zugriffe auf Dashboard-Seiten

---

## 🔄 Datenfluss & Authentifizierungsprozess

### 1. Login & Magic Link Erzeugung
- Benutzer ruft `https://desk.smartpages.online/de/login` auf.
- Das Login-Formular sendet `POST /api/auth/start` an den Core Worker (`api.smartpages.online`).
- Core Worker prüft E-Mail, erstellt Token, speichert ihn in `AUTH_DB` und sendet ihn an den Mailer Worker.
- Mailer Worker versendet den Magic Link:  
  `https://desk.smartpages.online/redirect?token=<UUID>&lang=de`

### 2. Token-Validierung (redirect.astro)
- Nutzer klickt auf den Link.
- Die Redirect-Seite ruft intern auf:  
  `GET /api/auth/verify?token=<UUID>&lang=de`
- Core Worker prüft Gültigkeit, legt Token temporär in `STAGING` (KV).
- Antwort enthält Redirect-Pfad: `/api/auth/confirm?token=<UUID>`

### 3. Session-Erstellung
- Redirect-Client ruft `/api/auth/confirm` auf.
- Core Worker liest `STAGING`, erstellt Session-Datensatz in `SESSION` (KV, TTL 12h).
- Cookie wird gesetzt:  
  `session=<UUID>; Secure; HttpOnly; SameSite=None`
- User wird weitergeleitet zu:  
  `https://desk.smartpages.online/<lang>/dashboard`

### 4. Dashboard & Middleware
- Middleware prüft Cookie nur für geschützte Dashboard-Seiten.
- Kein Eingriff bei `/login`, `/redirect` oder `/api/*`.
- Falls keine Session vorhanden: Redirect zur Login-Seite.

### 5. Datenabruf (Core ↔ Customer)
- Dashboard ruft `GET /api/customer/customer` auf.
- Core Worker validiert Session und leitet Request intern weiter:
  ```js
  env.CUSTOMER.fetch('/profile', {
    headers: {
      'x-session-email': 'frank@profi-marketing.com',
      'x-session-plan': 'trial',
      'x-session-lang': 'de'
    }
  });
  ```
- Customer Worker liest aus `CUSTOMER_DB`, aktualisiert `last_login`, liefert Datensatz zurück.
- Core Worker gibt Antwort direkt ans Frontend weiter.

### 6. Dashboard-Komponenten
- **CustomerCard** zeigt Kundendaten (Vorname, Nachname, Plan, Status, letzte Anmeldung).
- **ImprintCard** (in Arbeit) ruft `/imprint` über denselben internen Kanal auf.
- **Modals** für Bearbeitung nutzen zukünftig `/update` und `/imprint/update`.

### 7. Logout
- Dashboard ruft `GET /api/auth/logout` auf.
- Core Worker löscht Session aus `SESSION` und setzt Cookie auf `Max-Age=0`.
- Redirect zur Login-Seite.

---

## 📡 Verfügbare API-Endpunkte

### Core Worker
| Endpoint | Methode | Beschreibung |
|-----------|----------|---------------|
| `/api/auth/start` | POST | Erstellt Magic Link & sendet ihn per E-Mail |
| `/api/auth/verify` | GET | Prüft Token und legt temporären Session-Eintrag an |
| `/api/auth/confirm` | GET | Erstellt Session & setzt Cookie |
| `/api/auth/logout` | GET | Beendet Session & löscht Cookie |
| `/api/session/check` | GET | Prüft bestehende Session |
| `/api/customer/*` | GET/POST | Leitet Anfrage intern an Customer Worker weiter |
| `/ping` | GET | Health Check für Core Worker |

### Customer Worker
| Endpoint | Methode | Beschreibung |
|-----------|----------|---------------|
| `/profile` | GET | Ruft Kundendaten aus der Datenbank ab |
| `/update` | POST | Aktualisiert Kundendaten |
| `/imprint` | GET | Liefert Impressumsdaten zurück |
| `/imprint/update` | POST | Aktualisiert Impressumsdaten |
| `/media/upload` | POST | Lädt Mediendateien in R2 hoch |
| `/cache/refresh` | POST | Aktualisiert Profile im KV-Cache |

---

## 🔍 Aktueller Entwicklungsstand
| Bereich | Status | Kommentar |
|----------|--------|------------|
| **Login & Authentifizierung** | 🟢 stabil | End-to-End Flow funktionsfähig |
| **Core Worker** | 🟢 stabil | Session & Token-Handling korrekt |
| **Customer Worker** | 🟢 stabil | Interne Bindings erfolgreich |
| **Middleware** | 🟢 gefixt | Login erreichbar, Schutz funktionsfähig |
| **Dashboard** | 🟡 in Arbeit | Modals & ImprintCard Anpassung folgt |
| **Payment / Role System** | 🔴 ausstehend | Integration nächster Schritt |

---

## 🔧 Nächste Schritte
1. Anpassung der **ImprintCard** an das neue Worker-Routing.
2. Fertigstellung der **Modals** zur Kundendatenbearbeitung.
3. Aufbau des **Rechtemanagements (Rollen)** in Sessions.
4. Integration des **Payment Workers**.

---

## 🧾 Zusammenfassung
Das SmartPages-System hat nun eine stabile interne Struktur erreicht. 
Durch die **Trennung von Core- und Customer-Worker** und die Nutzung von **Cloudflare Service Bindings** konnte die Architektur übersichtlich, sicher und performant gestaltet werden.

Mit dem Fix der `middleware.ts` und der funktionierenden Core-Authentifizierung ist das System bereit für den Ausbau von Zahlungs- und Rechtemodulen.

Der nächste Meilenstein ist die komplette Integration der Impressumsverwaltung und die Fertigstellung der Editor-Komponenten im Dashboard.
