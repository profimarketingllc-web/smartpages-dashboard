# SmartPages – Projektstruktur (Astro Frontend)

> **Stand:** stabiler Zwischenstand nach Dashboard-Refactor (Cards, Modals, Sidebar, i18n)
>
> Dieses Dokument beschreibt die **aktuelle, produktionsnahe Projektstruktur** des SmartPages Dashboards. Es ersetzt vollständig die frühere `PROJECT_STRUCTURE.md` und dient als **Referenz für Weiterentwicklung, Onboarding und Review**.

---

## 1. Projekt Root

Der Root enthält ausschließlich Infrastruktur, Build- und Dokumentationsartefakte. Anwendungslogik befindet sich **ausschließlich im **``**-Verzeichnis**.

```txt
smartpages-dashboard/
├── .astro/                         # Astro Cache / Build Artefakte
├── .github/                        # GitHub Actions / CI
├── .vscode/                        # Editor Settings
├── .wrangler/                      # Cloudflare Wrangler Configs
├── backups/                        # Manuelle Sicherungen (lokal)
├── dist/                           # Build Output (static)
├── documentation/                 # Architektur, Datenflüsse, Specs
│   ├── PROJECT_STRUCTURE.md
│   ├── README.md
│   ├── SmartPages_login_flow_DE.md
│   ├── SmartPages_login_flow_EN.md
│   ├── SmartPages_Worker_architektur_DE.md
│   └── SmartPages_Worker_architektur_EN.md
├── node_modules/
├── public/                         # Statische Assets
│   ├── favicon.ico
│   └── SmartPages_icon_transparent.png
├── scripts/                        # Helper / Deploy Scripts
├── src/                            # Anwendungscode (siehe Abschnitt 2)
├── astro.config.mjs
├── package.json
├── package-lock.json
├── publish.ps1
├── tailwind.config.cjs
├── tsconfig.json
└── README.md
```

---

## 2. Source (`/src`)

Der `/src`-Ordner enthält die vollständige Frontend-Applikation. Die Struktur folgt einem **feature-orientierten Ansatz**, nicht technisch (kein `components/ui/pages` Wildwuchs).

```txt
src/
├── components/
│   ├── pages/
│   │   ├── billing/               # vorbereitet
│   │   ├── dashboard/
│   │   │   ├── DashboardApp.jsx        # Solid Orchestrator
│   │   │   ├── CustomerCard.jsx
│   │   │   ├── ImprintCard.jsx
│   │   │   ├── PrivacyCard.jsx
│   │   │   └── modals/
│   │   │       ├── ModalWrapper.jsx
│   │   │       ├── CustomerModal.jsx
│   │   │       ├── ImprintModal.jsx
│   │   │       └── PrivacyModal.jsx
│   │   ├── login/                 # vorbereitet
│   │   ├── smartdomain/            # vorbereitet
│   │   ├── smartlinks/             # vorbereitet
│   │   ├── smartpage/              # vorbereitet
│   │   └── smartprofile/           # vorbereitet
│   │
│   ├── shared/                     # Wiederverwendbare Seiten-Bausteine
│   │   ├── SmartSidebar.astro
│   │   ├── ProductGrid.astro
│   │   ├── ProductCard.astro
│   │   └── SystemMessage.astro
│   │
│   └── ui/                         # Primitive UI-Elemente (dumb components)
│       ├── Button.astro
│       ├── Input.astro
│       ├── Textarea.astro
│       └── Toggle.astro
│
├── layouts/
│   └── PageLayout.astro
│
├── pages/                          # Astro Routing Layer
│   ├── checkout/
│   ├── de/
│   ├── en/
│   ├── features/
│   ├── 404.astro
│   ├── billing.astro
│   ├── dashboard.astro
│   ├── dashboard.astro.DISABLED
│   ├── debug-locals.astro
│   ├── error.astro
│   ├── forbidden.astro
│   ├── index.astro
│   ├── login.astro
│   ├── smartpage.astro
│   └── smartprofile.astro
│
├── styles/
│   └── global.css                  # Zentrales Design-System
│
└── utils/
    └── i18n/                       # Feature-spezifische Übersetzungen
        ├── billing.ts
        ├── dashboard.ts
        ├── de.ts
        ├── en.ts
        ├── features.ts
        ├── i18n.ts
        ├── login.ts
        ├── sidebar.ts
        ├── smartdomain.ts
        ├── smartlinks.ts
        ├── smartpage.ts
        └── smartprofile.ts
```

---

## 3. Bewusste Architektur-Entscheidungen

### Dashboard

- Solid.js wird **ausschließlich im Dashboard** eingesetzt
- `DashboardApp.jsx` orchestriert Cards & Modals
- Jede Card kapselt ihren eigenen State
- Modals sind **lokal angebunden**, kein globaler Modal-Store

### Datenfluss

- Initiale Userdaten kommen vom Worker über `window.SMARTPAGES_USER`
- Cards sind **rein darstellend (read-only)**
- Änderungen erfolgen über Modals → API → State-Update

### i18n

- Übersetzungen strikt pro Feature (z. B. `dashboard`, `sidebar`)
- Keine Logik in i18n-Dateien
- Components erhalten fertige Strings

### Sidebar

- Reines Astro-Component
- Farben, Hover & States vollständig über `global.css`
- Keine Produkt- oder Userlogik im Markup

---

## 4. Entfernt / bewusst nicht mehr genutzt

- ❌ SSR-Forms im Dashboard
- ❌ Globale Modal-Steuerung
- ❌ Verpflichtender `userContext`
- ❌ Sprach-Routing ausschließlich über `/de` und `/en`

