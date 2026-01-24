# 🧩 SmartPages Dashboard — PROJECT_STRUCTURE.md

**Projekt:** SmartPages  
**Slug:** smart  
**Stand:** 2026-01-24  
**Status:** IST-Zustand (manuell verifiziert)

---

## 📂 Root-Struktur

```
smartpages-dashboard/
├── .astro/
├── .github/
├── .vscode/
├── backups/
├── dist/
├── node_modules/
├── public/
│   ├── favicon.ico
│   └── SmartPages_icon_transparent.png
├── scripts/          (leer)
├── src/
│   ├── assets/       (leer)
│   │
│   ├── components/
│   │   ├── admin/    (leer)
│   │   ├── core/
│   │   │   ├── DashboardCardWide.astro
│   │   │   ├── ProductCard.astro
│   │   │   ├── ProductGrid.astro
│   │   │   ├── ProductHeader.astro
│   │   │   ├── ProductPill.astro
│   │   │   ├── SmartHeader.astro
│   │   │   ├── SmartSidebar.astro
│   │   │   └── SystemMessage.astro
│   │   ├── editor/
│   │   │   ├── ProductForm.astro
│   │   │   └── ProductPreview.astro
│   │   ├── solid/
│   │   │   ├── CustomerCard.jsx
│   │   │   ├── EditCustomerModal.jsx
│   │   │   ├── EditImprintModal.jsx
│   │   │   ├── EditPrivacyModal.jsx
│   │   │   ├── ImprintCard.jsx
│   │   │   ├── ModalWrapper.jsx
│   │   │   └── PrivacyCard.jsx
│   │   └── ui/
│   │       ├── Button.astro
│   │       ├── Card.astro
│   │       ├── Input.astro
│   │       └── Textarea.astro
│   │
│   ├── layouts/
│   │   └── PageLayout.astro
│   │
│   ├── middleware/
│   │   ├── access.ts
│   │   ├── index.ts
│   │   ├── lang.ts
│   │   └── user-session.ts
│   │
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── start.ts
│   │   │   │   ├── verify.ts
│   │   │   │   ├── confirm.ts
│   │   │   │   └── logout.ts
│   │   │   ├── billing/
│   │   │   │   └── checkout.ts
│   │   │   └── customer/
│   │   │       ├── customer.ts
│   │   │       ├── customeredit.ts
│   │   │       ├── imprint.ts
│   │   │       ├── imprintedit.ts
│   │   │       ├── privacy.ts
│   │   │       └── privacyedit.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── cancel.astro
│   │   │   ├── success.astro
│   │   │   └── upgrade.astro
│   │   │
│   │   ├── de/
│   │   │   ├── billing.astro
│   │   │   ├── dashboard.astro
│   │   │   ├── login.astro
│   │   │   ├── smartdomain.astro
│   │   │   ├── smartlinks.astro
│   │   │   ├── smartpage.astro
│   │   │   └── smartprofile.astro
│   │   │
│   │   ├── en/
│   │   │   ├── billing.astro
│   │   │   ├── dashboard.astro
│   │   │   ├── login.astro
│   │   │   ├── smartdomain.astro
│   │   │   ├── smartlinks.astro
│   │   │   ├── smartpage.astro
│   │   │   └── smartprofile.astro
│   │   │
│   │   ├── 404.astro
│   │   ├── debug-locals.astro
│   │   ├── error.astro
│   │   ├── forbidden.astro
│   │   ├── index.astro
│   │   └── redirect.astro
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── utils/
│   │   └── i18n/
│   │       ├── de.ts
│   │       ├── en.ts
│   │       └── i18n.ts
│   │
│   └── middleware.ts
│
├── .gitignore
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
├── package.json
├── package-lock.json
├── publish.ps1
├── README.md
└── PROJECT_STRUCTURE.md
```

---

## 🧭 Hinweise

- Diese Datei beschreibt **ausschließlich den verifizierten IST-Zustand**.
- Keine Architekturentscheidungen, keine Zukunftsannahmen.
- Dient als **Referenzbasis** für weitere technische Arbeit an SmartPages.
