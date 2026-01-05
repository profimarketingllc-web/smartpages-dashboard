# 🏗️ SmartPages Projektstruktur

Dieses Dokument beschreibt den Aufbau und die Architektur des SmartPages Dashboards.  
Es dient als Orientierung für Entwickler, Contributor und zukünftige Erweiterungen.

---

## 📦 Projektübersicht

```
SmartPages/
├── .github/                   # GitHub Actions, CI/CD Konfigurationen
├── public/                    # Statische Dateien (Bilder, Icons, etc.)
├── src/
│   ├── components/            # Alle UI-Komponenten
│   │   ├── core/              # Astro-Komponenten für das Dashboard-Grundlayout
│   │   │   ├── DashboardCardWide.astro
│   │   │   ├── ProductGrid.astro
│   │   │   ├── ProductCard.astro
│   │   │   ├── SmartHeader.astro
│   │   │   ├── SmartSidebar.astro
│   │   │   ├── SystemMessage.astro
│   │   │   └── README.md
│   │   ├── solid/             # Interaktive SolidJS-Komponenten (Reactive + API)
│   │   │   ├── CustomerCard.jsx
│   │   │   ├── ImprintCard.jsx
│   │   │   ├── EditCustomerModal.jsx
│   │   │   ├── EditImprintModal.jsx
│   │   │   └── ModalWrapper.jsx
│   │   ├── ui/                # Kleine UI-Bausteine und Wiederverwendungen
│   │   └── admin/             # Admin-spezifische UI-Elemente (in Arbeit)
│   │
│   ├── layouts/               # Globale Layouts für Seiten
│   │   └── PageLayout.astro
│   │
│   ├── styles/                # Zentrale Stylesheets (Tailwind + global.css)
│   │   └── global.css
│   │
│   ├── pages/                 # Seitenstruktur (mehrsprachig)
│   │   ├── de/                # Deutsche Seiten (Dashboard, Login, etc.)
│   │   └── en/                # Englische Seiten
│   │
│   └── data/                  # (optional) statische Inhalte oder JSONs
│
├── package.json               # Projektabhängigkeiten
├── astro.config.mjs           # Astro-Konfiguration (mit Alias-Regeln)
├── tailwind.config.mjs        # Tailwind-Konfiguration
├── tsconfig.json              # TypeScript-/JSX-Unterstützung
├── README.md                  # Projekteinleitung
└── PROJECT_STRUCTURE.md       # Diese Datei
```

---

## 🧭 Alias-Konfiguration (`astro.config.mjs`)

```js
alias: {
  "~": path.resolve("./src"),   // Für Layouts, Seiten, Utilities
  "@": path.resolve("./src"),   // Für Komponenten (UI, Core, Editor, Solid)
}
```

Diese Alias-Struktur erlaubt eine klare Trennung:
- `~` für allgemeine Projektstruktur (Layouts, Styles, Pages)
- `@` speziell für Komponentenimporte

Beispiel:
```js
import PageLayout from "~/layouts/PageLayout.astro";
import CustomerCard from "@/components/solid/CustomerCard.jsx";
```

---

## 🧩 Technologie-Stack

| Ebene | Technologie | Zweck |
|-------|--------------|--------|
| Framework | **Astro** | Server-Side Rendering, Layout-Struktur |
| Reactive Layer | **SolidJS** | Interaktive Komponenten (z. B. Kundendaten, Modals) |
| Styling | **TailwindCSS** | Utility-basiertes CSS-Designsystem |
| API / Datenbank | **Cloudflare Workers + D1** | Backend und Datenspeicherung |
| Hosting | **Cloudflare Pages** | Build & Deployment |
| Authentifizierung | **Magic Link Login** | Tokenbasierte Verifizierung |
| Speicherung | **R2** *(in Planung)* | Dateispeicher für Medieninhalte |

---

## 🚀 Build- & Deployment-Prozess

1. Änderungen committen:
   ```bash
   git add .
   git commit -m "Feature: Neue Solid-Komponente hinzugefügt"
   git push origin dev
   ```

2. Cloudflare erkennt den Push → erstellt Preview (z. B. `dev.smartpages.online`)  
3. Nach Review Merge in `main`:
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

4. Cloudflare baut automatisch den **Production Build**

---

## ⚙️ Projektkonventionen

- **Dateibenennung:** `PascalCase` für Komponenten, `kebab-case` für Seiten  
- **Sprache:** Variablen, Kommentare & Funktionen auf Englisch  
- **Framework-Klarheit:** Solid-Komponenten = `.jsx`  
- **Styling:** ausschließlich mit TailwindCSS, keine Inline-Styles  
- **Responsive Design:** Mobile-first Aufbau  
- **Aliasing:** `~` für Struktur / `@` für Komponenten  
- **Dokumentation:** `.md` Dateien in Root oder Unterordnern

---

## 📅 Letzte Aktualisierung

- **Datum:** 05. Januar 2026  
- **Autor:** Frank Hüser  
- **Version:** 1.2  
- **Status:** Aktiv (aktuelle Code-Struktur reflektiert)
