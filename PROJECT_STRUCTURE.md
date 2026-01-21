# 🧩 SmartPages Dashboard – Projektstruktur (v2.0 Final)

**Stand:** 21. January 2026  
**Status:** MVP  
**Deployment:** Cloudflare Pages + Wrangler  
**Sprachen:** Deutsch 🇩🇪 & Englisch 🇬🇧  
**Middleware:** aktiviert  

---

## 📂 Root

```
smartpages-dashboard/
│
├── .astro/
├── .github/
├── .vscode/
├── .wrangler/
│
├── backups/
├── dist/
├── node_modules/
├── public/
├── scripts/
│   ├── predeploy.mjs
│   ├── switch-wrangler.mjs
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── core/
│   │   │   ├── DashboardCardWide.astro
│   │   │   ├── ProductCard.astro
│   │   │   ├── ProductGrid.astro
│   │   │   ├── ProductHeader.astro
│   │   │   ├── ProductPill.astro
│   │   │   ├── SmartHeader.astro
│   │   │   ├── SmartSidebar.astro
│   │   │   ├── SystemMessage.astro
│   │   │   └── SmartPages_Core_README.md
│   │   │
│   │   ├── solid/
│   │   │   ├── CustomerCard.jsx
│   │   │   ├── ImprintCard.jsx
│   │   │   ├── PrivacyCard.jsx
│   │   │   ├── EditCustomerModal.jsx
│   │   │   ├── EditImprintModal.jsx
│   │   │   ├── EditPrivacyModal.jsx
│   │   │   └── ModalWrapper.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── Input.astro
│   │   │   └── Textarea.astro
│   │
│   │   └── admin/
│
│   ├── layouts/
│   │   └── PageLayout.astro
│
│   ├── middleware/
│   │   ├── index.ts
│   │   ├── user-session.ts
│   │   └── lang.ts
│
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── confirm.ts
│   │   │   │   ├── logout.ts
│   │   │   │   ├── start.ts
│   │   │   │   └── verify.ts
│   │   │   ├── customer/
│   │   │   │   ├── customer.ts
│   │   │   │   ├── customeredit.ts
│   │   │   │   ├── imprint.ts
│   │   │   │   ├── imprintedit.ts
│   │   │   │   ├── privacy.ts
│   │   │   │   └── privacyedit.ts
│   │   │   ├── paywall.ts
│   │   │   └── status.ts
│   │   │
│   │   ├── de/
│   │   │   ├── dashboard.astro
│   │   │   ├── login.astro
│   │   │   ├── smartdomain.astro
│   │   │   ├── smartpage.astro
│   │   │   └── smartprofile.astro
│   │   │
│   │   ├── en/
│   │   │   ├── dashboard.astro
│   │   │   ├── login.astro
│   │   │   ├── smartdomain.astro
│   │   │   ├── smartpage.astro
│   │   │   └── smartprofile.astro
│   │
│   │   ├── 404.astro
│   │   ├── debug-locals.astro
│   │   ├── error.astro
│   │   ├── index.astro
│   │   └── redirect.astro
│
│   ├── styles/
│   │   └── global.css
│   │
│   └── utils/
│       └── i18n/
│           ├── de.ts
│           ├── en.ts
│           └── i18n.ts
│
├── .gitignore
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
│
├── package.json
├── package-lock.json
│
├── wrangler.toml
├── wrangler.pages.toml
│
├── publish.ps1
├── README.md
└── PROJECT_STRUCTURE.md
```

---

## 🧠 Änderungen gegenüber ursprünglicher Version

| Kategorie | Änderung | Beschreibung |
|------------|-----------|---------------|
| 📁 `src/pages/api/` | Korrekte Struktur mit `auth/`, `customer/`, `paywall.ts`, `status.ts` | Deckt reale API-Architektur ab |
| 🧩 `debug-locals.astro` | Auf Root-Level in `/src/pages/` | Richtige Position |
| ⚙️ `wrangler.pages.toml` | Im Root enthalten | Für Cloudflare Pages |
| 🧱 `core/` | Erweiterte UI-Komponenten | Alle Product- und Smart-Komponenten enthalten |
| 🔹 Version | v2.0 (Final) | MVP-Release-Struktur |
