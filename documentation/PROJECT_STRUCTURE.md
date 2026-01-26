# SmartPages – Projektstruktur (Astro Frontend)

> **Scope dieses Dokuments:** Nur das Astro-Frontend (`smartpages-dashboard`).
>
> Worker (Core, Billing etc.) werden **bewusst in einem separaten Architektur‑Dokument** gepflegt.

Dieses Dokument ist die **Single Source of Truth** für die Frontend‑Architektur und Routing‑Struktur.

---

## 1. Projekt Root

```txt
smartpages-dashboard/
├── .astro/                 # Astro Cache (lokal, ignoriert)
├── .github/                # GitHub Workflows / Meta
├── .vscode/                # Editor Settings (optional)
├── .wrangler/              # Cloudflare Wrangler Cache
├── backups/                # lokale Backups (nicht versionieren)
├── dist/                   # Build Output (generiert)
├── node_modules/           # Abhängigkeiten (nicht versioniert)
├── public/                 # Statische Assets
│   ├── favicon.ico
│   └── SmartPages_icon_transparent.png
├── scripts/                # lokale Hilfs-/Deploy-Skripte
├── src/                    # Application Code
├── .gitignore
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tailwind.config.cjs
├── tsconfig.json
├── publish.ps1             # lokales Publish Script
└── README.md
```

**Hinweise:**

- Nur strukturell relevante Ordner sind hier dokumentiert.
- Cache-, Build- und lokale Tool-Ordner (`.astro`, `node_modules`, `dist`, `backups`) dienen nur der Entwicklung.
- `public/` enthält ausschließlich globale statische Assets.

---


## 2. Source Code (`/src`)

```txt
src/
├── components/
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── astro/
│   │   │   │   └── SystemMessage.astro
│   │   │   └── solid/
│   │   │       ├── CustomerCard.jsx
│   │   │       ├── EditCustomerModal.jsx
│   │   │       ├── EditImprintModal.jsx
│   │   │       ├── EditPrivacyModal.jsx
│   │   │       ├── ImprintCard.jsx
│   │   │       ├── PrivacyCard.jsx
│   │   │       └── ModalWrapper.jsx        # zentraler Wrapper für alle Modals
│   │   │
│   │   ├── billing/
│   │   │   ├── astro/
│   │   │   └── solid/
│   │   │
│   │   ├── login/
│   │   ├── smartpage/
│   │   ├── smartprofile/
│   │   ├── smartdomain/
│   │   └── smartlinks/
│   │
│   ├── editor/
│   │   ├── ProductForm.astro
│   │   └── ProductPreview.astro
│   │
│   ├── admin/             # reserviert
│   │
│   ├── shared/
│   │   ├── DashboardCardWide.astro
│   │   ├── ProductCard.astro
│   │   ├── ProductGrid.astro
│   │   ├── ProductHeader.astro
│   │   ├── ProductPill.astro
│   │   ├── SmartHeader.astro
│   │   └── SmartSidebar.astro
│   │
│   └── ui/
│       ├── Button.astro
│       ├── Card.astro
│       ├── Input.astro
│       └── Textarea.astro
│
├── layouts/
│   └── PageLayout.astro
│
├── middleware/
│   ├── access.ts          # Paywall / Feature-Gates
│   ├── user-session.ts    # Session + Auth
│   ├── lang.ts            # i18n routing
│   └── index.ts
│
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── start.ts
│   │   │   ├── confirm.ts
│   │   │   ├── verify.ts
│   │   │   └── logout.ts
│   │   │
│   │   ├── billing/
│   │   │   └── checkout.ts
│   │   │
│   │   └── customer/
│   │       ├── customer.ts
│   │       ├── customeredit.ts
│   │       ├── imprint.ts
│   │       ├── imprintedit.ts
│   │       ├── privacy.ts
│   │       └── privacyedit.ts
│   │
│   ├── checkout/
│   │   ├── success.astro
│   │   ├── cancel.astro
│   │   └── upgrade.astro
│   │
│   ├── de/
│   │   ├── dashboard.astro      # Wrapper → leitet auf /dashboard.astro
│   │   ├── billing.astro
│   │   ├── login.astro
│   │   ├── smartpage.astro
│   │   ├── smartprofile.astro
│   │   ├── smartdomain.astro
│   │   └── smartlinks.astro
│   │
│   ├── en/
│   │   ├── dashboard.astro      # Wrapper → leitet auf /dashboard.astro
│   │   ├── billing.astro
│   │   ├── login.astro
│   │   ├── smartpage.astro
│   │   ├── smartprofile.astro
│   │   ├── smartdomain.astro
│   │   └── smartlinks.astro
│   │
│   ├── dashboard.astro          # Zentrale Dashboard-Seite
│   ├── index.astro
│   ├── redirect.astro
│   ├── error.astro
│   ├── forbidden.astro
│   ├── debug-locals.astro
│   └── 404.astro
│
├── styles/
│   └── global.css
│
├── utils/
│   └── i18n/
│       ├── billing.ts
│       ├── dashboard.ts
│       ├── login.ts
│       ├── smartdomain.ts
│       ├── smartlinks.ts
│       ├── smartpage.ts
│       ├── smartprofile.ts
│       ├── de.ts                # Sprach-Mapping DE
│       ├── en.ts                # Sprach-Mapping EN
│       └── i18n.ts              # Resolver / Loader
│
└── middleware.ts

---

## 3. Architektur-Prinzipien

- Routing nur in `/pages`
- Sprachpfade (`/de`, `/en`) enthalten **nur Wrapper-Seiten**
- Zentrale Seiten liegen auf Root-Ebene von `/pages`
- Business-Logik in Components / API
- Paywall ausschließlich über Middleware (`access.ts`)
- Übersetzungen nach **Feature/Page**, nicht nach Sprache strukturiert
- UI primitives ≠ Feature components

---

Status: **Frontend Struktur finalisiert (Astro, Stand 25.01.2026)**


