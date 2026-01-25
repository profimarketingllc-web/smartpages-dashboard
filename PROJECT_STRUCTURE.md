# SmartPages – Projektstruktur (katalogisierter IST-Stand)

Dieses Dokument ist die **zentrale Referenz** für die Architektur von `smartpages-dashboard`. Es zeigt **die komplette Projektstruktur**, logisch gegliedert in Ebenen.

Ziel:

- jederzeit Überblick behalten
- spätere Erweiterungen ohne Strukturverlust ermöglichen
- externen Entwicklern sofortige Orientierung geben

> 📌 Hinweis: Inhalte der Ordner werden **inkrementell ergänzt**. Die Struktur ist bewusst zuerst vollständig katalogisiert 

---

## 1. Projekt Root (Tooling & Kontext)

```txt
smartpages-dashboard/
├── package.json              # Abhängigkeiten & Scripts
├── package-lock.json
├── astro.config.mjs          # Astro-Konfiguration
├── tailwind.config.cjs       # Tailwind Setup
├── tsconfig.json             # TypeScript Basis
├── README.md
├── PROJECT_STRUCTURE.md      # Dieses Dokument
├── public/                   # Statische Assets (Images, Icons)
│     ├── favicon.ico
│     └── images/
├── dist/                     # Build-Output (generiert)
└── node_module               # Abhängigkeiten (nicht versioniert)  
```

---

## 2. Applications-Code (`/src`)

```txt
src/ 
├── components/
│   ├── pages/
│   │    ├── dashboard/
│   │    │   ├── astro/
│   │    │   │    └──SystemMessage.astro
│   │    │   │
│   │    │   └── solid/
│   │    │       ├── CustomerCard.jsx
│   │    │       ├── EditCustomerModal.jsx
│   │    │       ├── EditImprintModal.jsx
│   │    │       ├── EditPrivacyModal.jsx
│   │    │       ├── ImprintCard.jsx
│   │    │       └── PrivacyCard.jsx
│   │    │  
│   │    ├── billing/
│   │    │   ├── astro/
│   │    │   └── solid/
│   │    │
│   │    ├── login/                  # Login-Seite (authentifizierungsnah)
│   │    ├── smartpage/
│   │    ├── smartprofile/
│   │    ├── smartdomain/
│   │    └── smartlinks/
│   │
│   ├── editor/                      # Feature-Logik (Editoren)
│   │   ├── ProductForm.astro
│   │   └── ProductPreview.astro
│   │
│   ├── admin/                       # Admin-/Systemnahe Komponenten
│   │   (derzeit leer)
│   │
│   ├── shared/                         # Seitenübergreifende UI- & Layout-Bausteine
│   │   ├── DashboardCardWide.astro
│   │   ├── ProductCard.astro
│   │   ├── ProductGrid.astro
│   │   ├── ProductHeader.astro
│   │   ├── ProductPill.astro
│   │   ├── SmartHeader.astro
│   │   └── SmartSidebar.astro 
│   │
│   └── ui/                          # Primitive UI-Elemente
│       ├── Button.astro
│       ├── Card.astro
│       ├── Input.astro
│       └── Textarea.astro
│
├── layouts/                         # Globale Layouts
│   └── PageLayout.astro
│
├── middleware/                      # Astro Middleware
│   ├── access.ts
│   ├── index.ts
│   ├── lang.ts
│   └── user-session.ts
│
├── pages/                           # Routing-Ebene (Astro)
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
│   │   ├── dashboard.astro
│   │   ├── billing.astro
│   │   ├── login.astro
│   │   ├── smartpage.astro
│   │   ├── smartprofile.astro
│   │   ├── smartdomain.astro
│   │   └── smartlinks.astro
│   │
│   ├── en/
│   │   ├── dashboard.astro
│   │   ├── billing.astro
│   │   ├── login.astro
│   │   ├── smartpage.astro
│   │   ├── smartprofile.astro
│   │   ├── smartdomain.astro
│   │   └── smartlinks.astro
│   │
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
│       ├── de.ts
│       ├── en.ts
│       └── i18n.ts
│
└── middleware.ts
```

---

## 3. Leitprinzip

Die **Struktur ist wichtiger als der aktuelle Inhalt**.

- Ordner geben Orientierung
- Inhalte dürfen wachsen
- Anpassungen erfolgen kontrolliert

Diese Datei ist der **Single Source of Truth** für die Projektarchitektur.

