# 🧩 SmartPages Dashboard – Projektstruktur (v1.9)

**Stand:** Januar 2026  
**Status:** Production Stable  
**Core Worker:** v8.5 (Cloudflare)  
**Customer Worker:** v5.1 (Internal Service Binding)  
**Astro Build:** v6 SSR (Stable Release)

```
smartpages-dashboard/
│
├── public/                             # Statische Assets, Icons, Favicon, Logos
│
├── src/
│   ├── assets/                         # Bilder, Schriftarten, Logos
│   │
│   ├── components/
│   │   ├── core/                       # Dashboard UI-Komponenten (Astro)
│   │   │   ├── SmartHeader.astro
│   │   │   ├── SmartSidebar.astro
│   │   │   ├── DashboardCardWide.astro
│   │   │   ├── ProductGrid.astro
│   │   │   └── SystemMessage.astro
│   │   ├── solid/                      # JSX-Komponenten (Solid.js)
│   │   │   ├── CustomerCard.jsx        # Funktioniert mit Core & Customer Worker
│   │   │   ├── ImprintCard.jsx         # Muss noch angepasst werden
│   │   │   ├── EditCustomerModal.jsx
│   │   │   ├── EditImprintModal.jsx
│   │   │   └── ModalWrapper.jsx
│   │   ├── ui/                         # Basiselemente (Formulare, Buttons)
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── Input.astro
│   │   │   └── Textarea.astro
│   │   └── admin/                      # Geplante Admin-Komponenten
│   │
│   ├── layouts/                        # Globale Layout-Komponenten
│   │   └── PageLayout.astro            # Universales Layout für Seiten
│   │
│   ├── middleware.ts                   # Session-Check & Weiterleitung (global)
│   │
│   ├── pages/
│   │   ├── api/                        # API-Endpunkte (Proxy zum Core Worker)
│   │   │   ├── auth/                   # Authentifizierung
│   │   │   │   ├── start.ts
│   │   │   │   ├── verify.ts
│   │   │   │   ├── confirm.ts
│   │   │   │   └── logout.ts
│   │   │   ├── customer/               # Kundendaten-Endpunkte
│   │   │   │   ├── customer.ts         # Profil abrufen
│   │   │   │   ├── customeredit.ts     # Profil bearbeiten
│   │   │   │   ├── imprint.ts          # Impressum abrufen
│   │   │   │   └── imprintedit.ts      # Impressum bearbeiten
│   │   │   ├── paywall.ts              # Zugriffsbeschränkungen / Tarife
│   │   │   ├── status.ts               # Systemstatus-Abfrage
│   │   │   └── index.ts                # Fallback / Catch-All für API
│   │   ├── de/                         # Deutsche Version
│   │   │   ├── login.astro             # Login-Seite (DE)
│   │   │   └── dashboard.astro         # Haupt-Dashboard (DE)
│   │   ├── en/                         # Englische Version
│   │   │   ├── login.astro             # Login-Seite (EN)
│   │   │   └── dashboard.astro         # Haupt-Dashboard (EN)
│   │   ├── redirect.astro              # Gemeinsame Token-/Magic-Link-Seite
│   │   ├── 404.astro                   # Fehlerseite für ungültige Routen
│   │   ├── error.astro                 # UI-Fehlerseite (Runtime Errors)
│   │   └── index.astro                 # Einstiegspunkt (Root-Router)
│   │
│   ├── styles/                         # Globale Stylesheets
│   │   └── global.css                  # Hauptstylesheet (Tailwind + Custom)
│   │
│   └── utils/
│       └── i18n.ts                     # Sprachunterstützung & Übersetzungen
│
├── package.json
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
├── publish.ps1                         # Deployment Script für Cloudflare Pages
├── README.md                           # Projektdokumentation
└── PROJECT_STRUCTURE.md                # Diese Datei (aktualisiert)
```

---

### 💡 Änderungen in Version 1.9:
- **Layouts:** Nur `PageLayout.astro` vorhanden (zentrale Layout-Datei).
- **Middleware:** Liegt im `/src`-Hauptverzeichnis, nicht mehr in eigenem Ordner.
- **API:** Enthält jetzt auch `paywall.ts` und `status.ts` als System-Endpunkte.
- **Styles:** Nur `global.css` aktiv, `components.css` wurde entfernt.
- **Ordner `session` & `system`:** Entfernt, da diese Endpunkte in `/api/` integriert sind.
- **Redirect:** Nur eine globale `redirect.astro` für alle Sprachen.
