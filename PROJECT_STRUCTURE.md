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
│   │   ├── core/              # Zentrale Dashboard-Komponenten
│   │   │   ├── CustomerCard.jsx
│   │   │   ├── ImprintCard.jsx
│   │   │   ├── DashboardCardWide.astro
│   │   │   ├── ProductGrid.astro
│   │   │   ├── ProductCard.astro
│   │   │   ├── SmartHeader.astro
│   │   │   ├── SmartSidebar.astro
│   │   │   ├── SystemMessage.astro
│   │   │   └── README.md
│   │   ├── layout/            # Globale Layout-Komponenten (z. B. PageLayout)
│   │   └── shared/            # Für zukünftige gemeinsame UI-Elemente
│   │
│   ├── layouts/               # Seitenlayouts (z. B. PageLayout.astro)
│   ├── pages/                 # Seitenstruktur
│   │   ├── de/                # Deutsche Seiten (Dashboard, Login, etc.)
│   │   └── en/                # Englische Seiten
│   ├── styles/                # Globale Stylesheets (Tailwind, Variablen etc.)
│   └── utils/                 # Hilfsfunktionen, Datenabruf etc.
│
├── package.json               # Projektabhängigkeiten
├── astro.config.mjs           # Astro Konfiguration
├── tailwind.config.mjs        # Tailwind Konfiguration
├── tsconfig.json              # TypeScript/JSX Unterstützung
├── README.md                  # Projekteinleitung (optional für das Repo)
├── PROJECT_STRUCTURE.md       # Diese Datei
└── LICENSE                    # Rechtliches, falls vorhanden
```

---

## 🧩 Technologie-Stack

| Ebene | Technologie | Zweck |
|-------|--------------|-------|
| Frontend | **Astro** | SSR Framework für Seitenaufbau |
| Client-Interaktivität | **SolidJS** | Reaktive Komponenten für Live-Daten |
| Styling | **TailwindCSS** | Utility-basiertes Styling |
| Authentifizierung | **Magic Link** (Planung) | Token-basierte User-Verifizierung |
| Backend | **Cloudflare Workers + D1** | Serverless API und Datenbank |
| Deployment | **Cloudflare Pages** | Hosting und CI/CD |
| Storage | **R2** (geplant) | File Storage für Medieninhalte |

---

## 🧱 Branch-Architektur

| Branch | Zweck |
|--------|-------|
| **main** | Produktionsumgebung (aktiver Build) |
| **dev** | Entwicklungs- und Testumgebung |
| **admin** *(optional)* | zukünftiger Admin-Bereich |
| *(preview)* | Vorschau-Deployments durch Cloudflare |

---

## 🚀 Build- und Deployment-Prozess

1. Änderungen lokal committen  
   ```bash
   git add .
   git commit -m "Feature: Neue Komponente hinzugefügt"
   git push origin dev
   ```

2. Cloudflare erkennt automatisch den Push auf den Branch  
   → baut das Projekt  
   → und erstellt eine Vorschau (`dev.smartpages.online`)

3. Nach erfolgreicher Prüfung Merge in `main`  
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

4. Cloudflare deployt automatisch auf **Production**

---

## ⚙️ Projektkonventionen

- **Dateibenennung:** `PascalCase` für Komponenten, `kebab-case` für Seiten  
- **Sprache:** Alle Variablen, Kommentare und Benennungen in Englisch  
- **Framework-Klarheit:** Solid-Komponenten immer als `.jsx`  
- **Pfad-Importe:** Immer mit `~`-Alias (z. B. `~/components/core/CustomerCard.jsx`)
- **Keine Inline-Styles** — ausschließlich TailwindCSS  
- **Responsive Design:** Alle Seiten sind mobile-first aufgebaut

---

## 🧭 Verantwortlichkeiten (Stand: Januar 2026)

| Bereich | Verantwortlich |
|----------|----------------|
| Projektleitung | Frank Hüser |
| Architektur & Entwicklung | SmartPages GPT |
| Deployment & Infrastruktur | Cloudflare Pages / Workers |
| UI/UX Design | Tailwind + SmartPages Layout-Team |
| API & Datenanbindung | SmartPages D1 / Data Worker |

---

## 📅 Letzte Aktualisierung
- **Datum:** 03. Januar 2026  
- **Autor:** Frank Hüser  
- **Version:** 1.0  
- **Status:** Aktiv (DEV und MAIN synchronisiert)
