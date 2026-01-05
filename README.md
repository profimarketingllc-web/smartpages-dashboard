# 🧩 SmartPages Dashboard

**SmartPages** ist ein internes Dashboard-System zur Verwaltung von Profilen, Webseiten und Domains.  
Es dient **nicht der Vermarktung**, sondern als **zentrale Arbeitsplattform** für Content-Management,  
Automatisierung und interne Organisation.

---

## 🧭 Überblick

Das Dashboard ermöglicht:

- Verwaltung persönlicher und geschäftlicher **Profilinformationen**
- Erstellung und Pflege von **Webseiten und Inhalten** (SmartPage)
- Verwaltung von **Domains und SSL-Zertifikaten** (SmartDomain)
- Direkte Verbindung zu **Cloudflare D1** (Datenhaltung) und **R2** (Dateispeicher, in Planung)
- **DSGVO-konformes Hosting** und Betrieb ausschließlich in Europa

Ziel ist die Schaffung einer **einheitlichen, sicheren und modularen Infrastruktur**  
für interne Arbeitsabläufe und die Automatisierung von Content-Prozessen.

---

## 🧩 Technologie-Stack

| Bereich | Technologie | Beschreibung |
|----------|-------------|---------------|
| Framework | **Astro** | Serverseitiges Rendering & statisches Site-Deployment |
| Reactive Layer | **SolidJS** | Interaktive Komponenten (z. B. Kundendaten, Modals) |
| Styling | **TailwindCSS** | Utility-first CSS Framework |
| Backend / API | **Cloudflare Workers + D1** | Serverless API & SQLite-Datenbank |
| Hosting | **Cloudflare Pages** | CI/CD, Build & Deployment |
| Authentifizierung | **Magic Link Login** | Passwortloses Login über Token |
| Speicherung | **R2 (Cloudflare)** *(in Planung)* | DSGVO-konformes File Storage System |

---

## 🧱 Projektstruktur

Die vollständige Dokumentation der Dateistruktur befindet sich in  
[`PROJECT_STRUCTURE_v1.2.md`](./PROJECT_STRUCTURE_v1.2.md)

Kurzüberblick:
```
src/
├── components/
│   ├── core/       → Dashboard-Komponenten (Astro)
│   ├── solid/      → Reaktive SolidJS-Komponenten
│   ├── ui/         → Basis-UI-Komponenten
│   └── admin/      → Admin-spezifische UI
├── layouts/        → Seitenlayouts (z. B. PageLayout.astro)
├── styles/         → globale Stylesheets (global.css)
├── pages/          → Dashboard-, Login-, Setup-Seiten
└── data/           → (optional) statische Inhalte
```

---

## ⚙️ Setup & Entwicklung

### 🔧 Voraussetzungen
- Node.js ≥ 20  
- npm ≥ 10  
- Git  
- Cloudflare CLI (für Deployment)

---

### 🏁 Lokales Setup

```bash
# Repository klonen
git clone https://github.com/profimarketingllc-web/smartpages-dashboard.git
cd smartpages-dashboard

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Dashboard ist dann erreichbar unter:  
👉 `http://localhost:4321`

---

### 🚀 Build & Deployment

```bash
# Production Build erstellen
npm run build

# Preview-Server starten
npm run preview
```

Cloudflare Pages erkennt automatisch jeden Push auf `main`  
und erstellt daraus den Production-Build.

---

## 🧠 Entwicklungsprinzipien

- **Modularität:** Jede Komponente ist wiederverwendbar und klar gekapselt  
- **Klarheit:** Saubere Struktur, einheitliche Namensgebung, deutsch kommentiert  
- **Zukunftssicher:** Nutzung moderner Tools (Astro, Solid, Cloudflare Workers)  
- **Datenschutz:** Keine externen Tracker, keine Schriftarten von Drittanbietern  
- **Performance:** Lazy Loading, SSR, optimierte Stylesheets  
- **Flexibilität:** Dashboard ist anpassbar und erweiterbar für zukünftige Module  

---

## 🧑‍💻 Entwicklung & Pflege

| Name | Rolle | Aufgaben |
|------|-------|-----------|
| **Frank Hüser** | Entwickler & UI Designer | Konzept, Design & Implementierung |
| **Profi Marketing LLC** | Betreiber & Infrastruktur | Server, Hosting & Deployment |

---

## 🕓 Versionierung

| Version | Datum | Änderungen |
|----------|--------|------------|
| 1.0 | 2025-12-29 | Basis-Setup & Dashboard-Struktur |
| 1.1 | 2026-01-02 | UI & Komponenten-System (Solid) |
| 1.2 | 2026-01-05 | Finales Dashboard-Design & Struktur |
| 1.3 | 2026-01-06 | Umstellung auf interne Nutzung (nicht kommerziell) |

---

## 🔒 Datenschutz & Betrieb

- Vollständig in der **EU gehostet**  
- **Keine** externen Ressourcen (keine Google Fonts, keine CDN-Tracker)  
- Speicherung über **Cloudflare D1** (strukturierte Daten)  
- Planung: Integration von **R2** für Datei-Uploads (Impressum, Profilbilder etc.)  
- Zugriff geschützt durch Magic Link Token-Authentifizierung  

---

## 📄 Lizenz

© 2026 Profi Marketing LLC  
Alle Rechte vorbehalten.  
Nur für **interne Nutzung** – keine kommerzielle Weitergabe oder Veröffentlichung erlaubt.

---

## 📬 Kontakt

**Profi Marketing LLC**  
📧 info@profi-marketing-llc.com  
🌐 [https://smartpages.online](https://smartpages.online)
