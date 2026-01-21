# SmartPages Plattform

## 🌍 Projektübersicht

**SmartPages** ist eine modulare Cloud-Plattform zur einfachen und rechtssicheren Veröffentlichung persönlicher oder geschäftlicher Online-Auftritte.  
Sie bildet die technische Grundlage für drei Produkte – **SmartProfile**, **SmartPage** und **SmartDomain** – mit denen Nutzer in nur wenigen Minuten ihre eigene Website erstellen und online präsentieren können.  

Ziel ist es, jedem Anwender einen schnellen, DSGVO-konformen und professionellen Einstieg ins Internet zu ermöglichen – ohne technisches Wissen, Agenturkosten oder klassischen Serverbetrieb.  

### 🚀 Die SmartPages-Produkte

| Produkt | Beschreibung | Zielgruppe |
|----------|---------------|-------------|
| 🪪 **SmartProfile** | Eine persönliche Profilseite für Social Media, Portfolios oder Bio-Links – in Minuten erstellt. | Einzelpersonen, Creator, Freelancer |
| 🧩 **SmartPage** | Eine kompakte Website mit Impressum, Datenschutz und bis zu fünf Unterseiten – rechtssicher und mobil optimiert. | Selbstständige & kleine Unternehmen |
| 🌐 **SmartDomain** | Eine Premium-Lösung mit eigener Domain, Hosting und vollständiger Markenanpassung. | Unternehmen & Marken mit eigenem Webauftritt |

### ⚙️ Technische Grundlage

SmartPages basiert auf einer modernen **Cloudflare-Architektur** mit serverlosen Komponenten.  
Die gesamte Plattform läuft ohne klassische Server und nutzt:

- **SmartCore Worker** – zentrale Steuerung von Authentifizierung, Daten und Services  
- **SmartCustomer Worker** – Schnittstelle für Nutzerdaten und Kundenverwaltung  
- **SmartDashboard** – Benutzeroberfläche für Administration und Konfiguration  
- **Cloudflare KV / D1 / R2** – für Sitzungsmanagement, Datenbank und File Storage  
- **Astro + SolidJS + Tailwind** – für ein performantes, modulares Frontend  

Diese Struktur ermöglicht eine hohe Performance, globale Verfügbarkeit und einfache Skalierbarkeit – ideal für eine Plattform, die hunderte von SmartPages gleichzeitig ausliefert.

### 🧭 Dashboard-Module

Das **SmartDashboard** bietet eine zentrale Oberfläche zur Verwaltung von Inhalten und rechtlichen Informationen. Es dient als persönliches Kontrollzentrum für jeden Nutzer.

Aktuell verfügbare Module:

- **CustomerCard** – zeigt persönliche und geschäftliche Kundendaten, Vertragsstatus und Planinformationen.  
- **ImprintCard** – generiert ein rechtssicheres Impressum auf Basis der Benutzerdaten.  
- **PrivacyCard** – erstellt automatisch eine DSGVO-konforme Datenschutzerklärung oder erlaubt den Upload eigener Texte.  
- **SystemMessage** – zeigt automatisch generierte Hinweise und Begrüßungen im Dashboard (z. B. Ablauf des Trials).  

Zukünftige Erweiterungen beinhalten ein erweitertes Seiten-Layout-System, eigene Textvorlagen und automatische Updates der rechtlichen Inhalte.

### 🔒 Datenschutz & Compliance

Alle SmartPages werden automatisch mit rechtssicheren Impressum- und Datenschutzseiten generiert.  
Die Inhalte werden zentral über das Dashboard verwaltet und regelmäßig aktualisiert, um den aktuellen DSGVO-Anforderungen zu entsprechen.  

### 🧱 Architekturüberblick

SmartPages besteht aus mehreren Cloudflare-Workern und Frontend-Modulen:

- **SmartCore Worker** – verwaltet Logik, Tokens, Session und API-Kommunikation  
- **SmartCustomer Worker** – regelt Kundendaten, Textvorlagen und Seiteninhalte  
- **SmartDashboard** – Astro-basierte Oberfläche zur Verwaltung aller Inhalte  

### 💡 Vision

SmartPages möchte den schnellsten und einfachsten Weg ins Internet bieten –  
ein System, das Design, Datenschutz und Hosting vereint, um Nutzern in nur 10 Minuten  
eine sichere und professionelle Online-Präsenz zu ermöglichen.
