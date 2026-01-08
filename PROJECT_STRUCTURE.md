# 🧩 SmartPages Dashboard — Project Structure v1.4.3
**Letztes Update:** 2026-01-07  
**Status:** Stable (pre-middleware-expansion)

## 1. 🏗️ Architekturprinzipien
Das SmartPages Dashboard ist modular aufgebaut und folgt einem Hybridmodell aus Astro (Server-Rendering) und SolidJS (Reactive UI Components). Der Code trennt klar zwischen Layout, Logik und Datenfluss und ist vollständig mehrsprachig (de/en) aufgebaut.

**Kernprinzipien:**
- Astro für Layouts, serverseitige Logik und statische Komponenten
- SolidJS für interaktive Module und Live-UI-Elemente (z. B. Kundenkarten, Modals)
- TailwindCSS für Design-System und Layout-Konsistenz
- D1 + KV für Daten- und Statusverwaltung
- API-Layer für Authentifizierung, Systemsteuerung & Magic-Link-Login

## 2. 📂 Verzeichnisstruktur (SRC)
src/
├── components/
│   ├── admin/                → Admin-spezifische Tools und Controls
│   ├── core/                 → Basis-Astro-Komponenten
│   │   ├── DashboardCardWide.astro
│   │   ├── ProductCard.astro
│   │   ├── ProductGrid.astro
│   │   ├── ProductHeader.astro
│   │   ├── ProductPill.astro
│   │   ├── SmartHeader.astro
│   │   ├── SmartSidebar.astro
│   │   ├── SystemMessage.astro
│   │   └── SmartPages_Core_README.md
│   ├── editor/               → Eingabe- & Vorschau-Komponenten
│   │   ├── ProductForm.astro
│   │   └── ProductPreview.astro
│   ├── solid/                → Interaktive SolidJS-Komponenten
│   │   ├── CustomerCard.jsx
│   │   ├── EditCustomerModal.jsx
│   │   ├── EditImprintModal.jsx
│   │   ├── ImprintCard.jsx
│   │   └── ModalWrapper.jsx
│   ├── ui/                   → Wiederverwendbare UI-Elemente
│   │   └── (Buttons, Inputs, Layout-Hilfen)
│   └── admin/                → Administrative UI-Komponenten
├── middleware/
│   ├── auth.ts               → Autorisierung, Zugriffsschutz & Sessionprüfung
│   └── lang.ts               → Sprachsteuerung (Referrer & URL-based)
├── pages/
│   ├── api/
│   │   └── auth.ts           → Magic-Link-Startpunkt (API Entry)
│   ├── de/
│   │   ├── login.astro       → Login-Page (Deutsch)
│   │   └── dashboard.astro   → Dashboard-Page (Deutsch)
│   └── en/
│       ├── login.astro       → Login-Page (Englisch)
│       └── dashboard.astro   → Dashboard-Page (Englisch)
├── styles/
│   └── global.css            → Zentrales Designsystem (Tailwind-Basis)
├── utils/
│   └── i18n.ts               → Sprachutilities & Übersetzungslogik
└── SmartPages_icon_transparent.png

## 3. ⚙️ Middleware & Auth Flow
Die Middleware ist aktiv und vollständig implementiert. Sie dient aktuell zwei Hauptfunktionen:

### 🔑 auth.ts
- Prüft Login-Status auf jeder geschützten Seite
- Greift auf Sessioninformationen (D1 oder KV) zu
- Leitet unautorisierte Nutzer automatisch zur Login-Page weiter
- Unterstützt Magic-Link-Token-Validierung

### 🌐 lang.ts
- Erkennt Sprache automatisch über Referrer oder URL-Pfad (/de/, /en/)
- Stellt beim Server-Rendering den richtigen Sprachkontext bereit
- Bindet sich dynamisch an Übersetzungslogik (utils/i18n.ts)

## 4. 🔌 Systemintegration
### 🗄️ D1 Datenbank
Wird für folgende Funktionen verwendet:
- Speicherung von Tageslogs (getDailyReport, postDailyLog)
- Verwaltung von Systemmeldungen und Nutzerstatus

### ⚙️ KV Storage
- Enthält temporäre Systemzustände (z. B. laufende API-Sessions)
- Speichert aktiv Systemmeldungen für die Dashboard-UI (SystemMessage.astro)

### 🌐 API Integration
- /pages/api/auth.ts enthält den zentralen Einstiegspunkt für Magic-Link-Login
- Übergibt Daten über CORS-sicheren POST-Call an die externe API (api.smartpages.online)

### 💬 SystemMessage Control
- Über D1 gesteuerte Systemnachrichten, eingebunden in src/components/core/SystemMessage.astro
- Darstellung und Styling dynamisch abhängig von Statusfeldern (success, warning, error)

## 5. 🚀 Build & Deployment
**Development:**
npm run dev

**Production:**
npm run build
npm run preview

**Deployment:**
- Automatisiert via GitHub → Cloudflare Pages
- wrangler.toml optional für D1- und KV-Bindings
- Tags:
  - design-final-2026-01-04 (Pre-Middleware)
  - stable-backup-2026-01-07 (Middleware aktiv, Login & Dashboard finalisiert)

## 6. 📘 Metadaten
- Version: 1.4.3
- Maintainer: Profi Marketing LLC
- Technologien: Astro · SolidJS · TailwindCSS · D1 · Cloudflare KV
- Status: Stable
- Region: EU (Datenschutz & Hosting konform mit DSGVO)
