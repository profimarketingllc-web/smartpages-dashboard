# 🧩 SmartPages Dashboard – Projektstruktur (v1.5)

**Stand:** Januar 2026  
**Status:** Production Ready  
**Core Worker:** v7.6 (Cloudflare)  
**Astro Build:** Stable Release  

---

## 📦 Projektübersicht

```
smartpages-dashboard/
│
├── public/                            # Statische Dateien, Assets, Icons, Favicon
│
├── src/
│   ├── components/
│   │   ├── admin/                     # Admin-spezifische Komponenten (zukünftig)
│   │   ├── core/                      # Zentrale Dashboard-Komponenten
│   │   │   ├── DashboardCardWide.astro
│   │   │   ├── ProductCard.astro
│   │   │   ├── ProductGrid.astro
│   │   │   ├── ProductHeader.astro
│   │   │   ├── ProductPill.astro
│   │   │   ├── SmartHeader.astro
│   │   │   ├── SmartSidebar.astro
│   │   │   ├── SystemMessage.astro
│   │   │   └── SmartPages_Core_README.md
│   │   ├── editor/                    # Platzhalter für künftige Editoren
│   │   ├── solid/                     # JSX-Komponenten (SolidJS)
│   │   │   ├── CustomerCard.jsx
│   │   │   ├── EditCustomerModal.jsx
│   │   │   ├── EditImprintModal.jsx
│   │   │   ├── ImprintCard.jsx
│   │   │   └── ModalWrapper.jsx
│   │   └── ui/                        # UI-Basiselemente (Astro)
│   │       ├── Button.astro
│   │       ├── Card.astro
│   │       ├── Input.astro
│   │       └── Textarea.astro
│   │
│   ├── middleware/
│   │   └── lang.ts                    # Sprachumschaltung (DE/EN)
│   │
│   ├── pages/
│   │   ├── api/                       # API-Endpunkte des Dashboards
│   │   │   ├── Customer/              # ⚠️ aktuell leer (geplant für Kundendaten)
│   │   │   ├── auth.ts
│   │   │   ├── logout.ts
│   │   │   ├── paywall.ts
│   │   │   ├── status.ts
│   │   │   └── verify.ts
│   │   ├── de/
│   │   │   └── login.astro            # Login-Seite (Deutsch)
│   │   ├── en/
│   │   │   └── login.astro            # Login-Seite (Englisch)
│   │   └── index.astro                # Einstiegspunkt / Router
│   │
│   └── utils/
│       └── i18n.ts                    # Sprachunterstützung & Übersetzungen
│
├── package.json
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
├── publish.ps1                        # Deployment Script
├── README.md                          # Projektdokumentation
└── PROJECT_STRUCTURE.md               # Diese Datei
```

---

## 🧱 Hinweise

- Alle API-Endpunkte liegen unter `/src/pages/api/`
- Der Ordner `/components/solid/` enthält interaktive JSX-Komponenten (SolidJS)
- `/components/core/` bildet das visuelle Grundgerüst des Dashboards  
  (Header, Sidebar, SystemMessage, Produktansichten)
- `/Customer/` ist aktuell leer und für künftige Kundendaten-APIs vorgesehen
- Der Cloudflare Core Worker (`api.smartpages.online`) läuft **außerhalb** dieses Repos

---

**Version:** v1.5  
**Autor:** SmartPages Dev Team (2026)  
**Lizenz:** © 2026 Profi Marketing
