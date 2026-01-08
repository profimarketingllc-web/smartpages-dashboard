# 🧭 SmartPages Dashboard
**Version:** v1.4.3  
**Stand:** Januar 2026  
**Status:** Production Stable  

## 🚀 Übersicht
Das **SmartPages Dashboard** ist eine moderne, mehrsprachige Cloudflare-Astro-Anwendung,  
die Benutzerkonten, Systemstatus und Inhalte über **KV- und D1-Bindings** verwaltet.  
Das System kombiniert ein minimalistisches Frontend mit einer robusten Middleware-Schicht  
und einem serverlosen **API-Layer** für Authentifizierung, Kundendaten und Impressum.

---

## 🧩 Architekturüberblick

```
Frontend (Astro + SolidJS)
        ↓
Middleware (auth.ts, lang.ts)
        ↓
API Layer (/api/* – Cloudflare Worker Functions)
        ↓
D1 (Datenbank) + KV (Session Store)
```

### 🏗 Hauptkomponenten

| Bereich | Zweck |
|----------|--------|
| `/src/pages/de/login.astro` & `/src/pages/en/login.astro` | Magic-Link Login Pages |
| `/src/pages/dashboard.astro` | Dashboard mit CustomerCard, ImprintCard, SystemMessage |
| `/src/pages/api/` | API-Endpoints für Auth, Customer, Imprint, Systemstatus |
| `/src/middleware/` | Sprache (lang.ts) & Authentifizierung (auth.ts) |
| `/src/utils/i18n.ts` | Mehrsprachigkeit (DE/EN) mit dynamischer Übersetzungslogik |
| `/src/components/core/` | Layout-Komponenten wie ProductGrid, ProductCard |
| `/src/components/dashboard/` | Funktionale Karten (CustomerCard, ImprintCard, SystemMessage) |

---

## ⚙️ Middleware

### 🔐 `auth.ts`
- Liest das Cookie `session_id`
- Prüft Session-Daten über `env.SESSION` (KV oder D1)
- Fallback: `{ user_id: null, guest: true }`
- Speichert Session in `locals.session` für alle Routen

### 🌍 `lang.ts`
- Ermittelt Sprache aus:
  - URL (`/en/` oder `/de/`)
  - Referrer
  - Cookie `lang`
- Setzt globale Variable `locals.lang`
- Synchronisiert Sprache über `x-smartpages-lang` Header

---

## 🗄 Datenbindungen (KV & D1)

| Binding | Zweck | Typ |
|----------|--------|------|
| `SESSION` | Speichert Session-Daten (auth.ts) | Cloudflare KV |
| `DB` | Enthält persistente Nutzerdaten, Systemstatus, Impressum | Cloudflare D1 |

Beide Bindings sind **optional**:
Wenn sie im Dev-Modus nicht verfügbar sind, wird automatisch ein **Dummy-Fallback** aktiviert.  

---

## 💬 SystemMessage Engine (D1-gesteuert)

- Zeigt Begrüßung & Statusnachrichten an  
- Liest dynamische Werte aus der D1-Tabelle `system_status`
- Verknüpfung über `locals.systemMessage → i18n.t(lang, key, "systemMessage")`

Beispiel:
```ts
locals.systemMessage = {
  key: "trialEndingSoon",
  status: "trial",
};
```

D1-Struktur:
```sql
CREATE TABLE system_status (
  user_id TEXT PRIMARY KEY,
  status TEXT,
  message_key TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lang TEXT DEFAULT 'de'
);
```

---

## 🌐 API-Layer & Worker-Runtime

Seit **v1.4** ist das Dashboard mit einer serverlosen API-Schicht ausgestattet,  
die direkt in der Cloudflare-Worker-Umgebung ausgeführt wird.  

### 🔗 Endpunkte

| Route | Funktion | Methode | Auth |
|--------|-----------|----------|------|
| `/api/auth/start` | Sendet Magic Link per E-Mail | `POST` | ❌ |
| `/api/customer/update` | Speichert Kundendaten | `POST` | ✅ |
| `/api/imprint` | Liefert Impressumsdaten | `GET` | ✅ |
| `/api/system/status` | (optional) Liest Systemstatus aus D1 | `GET` | ✅ |

Jeder Endpunkt:
- Läuft **serverless** als Cloudflare Function
- Greift über `env` auf `SESSION` & `DB` zu
- Gibt standardisierte JSON-Antwort zurück:
  ```json
  { "ok": true, "data": {...} }
  ```

Beispiel:
```ts
return new Response(
  JSON.stringify({ ok: false, error: "invalid_email" }),
  { status: 400 }
);
```

---

## 🧠 i18n-System

Alle Texte (UI, System, Buttons, Messages) sind in `/src/utils/i18n.ts` zentralisiert.  
Mit der Funktion:

```ts
t(lang, key, section)
```

z. B.:
```ts
t("de", "trialEndingSoon", "systemMessage")
```

Bei unbekannten Keys wird automatisch der Schlüsselname ausgegeben  
und eine Warnung in der Konsole protokolliert.

---

## 🧱 Frontend & UI-Komponenten

- **CustomerCard:** Zeigt Benutzerprofil mit Vorname, Nachname, Tarif, Status  
- **ImprintCard:** Verwaltet Impressumsdaten, speichert über `/api/imprint`  
- **SystemMessage:** Dynamische Begrüßung (neutral/personalisiert)  
- **ProductGrid & ProductCard:** Reusable UI-Elemente für Login- & Dashboard-Pages  
  - Responsive Layout (max. 1400 px)
  - Einheitliche Breite mit Login-Kacheln  
  - Animation via Tailwind (`hover:scale`, `shadow-xl`, etc.)

---

## 🧪 Entwicklungs- & Deployment-Hinweise

| Umgebung | Zweck | Besonderheiten |
|-----------|--------|----------------|
| **Development** | Lokaler Test ohne echte KV/D1 | Dummy-Daten & Logs |
| **Staging / -dev** | Preview Deployments | Verbindet zu Test-D1 |
| **Production** | Live auf Cloudflare Pages | KV + D1 aktiv |

### 💾 Backups
Git-Tags werden für Releases genutzt:
- `release-v1.4.1`: Vor Middleware-Integration  
- `release-v1.4.3`: Final mit API + SystemMessage

---

## 🧩 Deployment & Rebuild
Standardbefehl:

```bash
npm run build
npx astro build
```

Cloudflare Pages erkennt Middleware & API automatisch  
(`Using v2 root directory strategy` → Worker Routes aktiv).

---

## 🧾 Lizenz & Hosting
- Copyright © **2026 Profi Marketing**
- Alle Daten DSGVO-konform in der EU gehostet
- Deployment via **Cloudflare Pages + D1**
- Keine externen Tracking-Skripte

---

### ✅ Nächste Schritte
- [ ] DEV-Test mit aktivem D1-Endpoint `/api/system/status`
- [ ] API-Logging aktivieren
- [ ] Docs → DOCX exportieren (für Knowledge Base)
- [ ] v1.4.4 vorbereiten (MailQueue + Notification Center)
