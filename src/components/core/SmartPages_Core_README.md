# 🧩 SmartPages Core Components

Dieser Ordner enthält alle zentralen UI-Komponenten des SmartPages Dashboards.  
Er bildet die funktionale und visuelle Basis für alle Dashboard-Ansichten.  
Die Komponenten sind in **Astro** (serverseitig) und **SolidJS** (clientseitig) realisiert.

---

## 🔷 Astro-Komponenten

Dateien mit der Endung `.astro` werden serverseitig von Astro gerendert.  
Sie enthalten Layout-, Struktur- oder Anzeigeelemente, die **ohne Client-Scripting** auskommen.

Beispiele:
- `DashboardCardWide.astro` → Standard-Wrapper für Dashboard-Kacheln  
- `SmartHeader.astro` → Kopfbereich mit Branding und Titel  
- `SmartSidebar.astro` → Navigation für Seiten und Produkte  
- `SystemMessage.astro` → Anzeige globaler Systemmeldungen  
- `ProductGrid.astro` → Produktübersicht (Astro-Fallback-Version)

🧠 **Besonderheiten:**
- Keine direkte Datenbindung (Astro ist SSR-first)
- Ideal für Layouts, statische Inhalte oder serverseitige Komponenten
- Verwenden TailwindCSS für konsistentes Design

---

## 🟢 Solid-Komponenten

Dateien mit der Endung `.jsx` in diesem Ordner sind **SolidJS-Komponenten**  
und werden **clientseitig gerendert** (per `client:load` oder `client:visible`).

Beispiele:
- `CustomerCard.jsx` → Zeigt Kundendaten im Dashboard an  
- `ImprintCard.jsx` → Zeigt Impressums- und Profildaten des Nutzers

🧠 **Besonderheiten:**
- Vollständig reaktiv (Solid Signals, createResource, etc.)
- Ideal für Live-Daten, Statusanzeigen und Interaktion  
- Werden über Astro-Komponenten eingebunden, z. B.:

  ```astro
  <CustomerCard client:load />
  <ImprintCard client:load />
  ```

💡 Hinweis:
> Auch wenn `.jsx` üblicherweise mit React assoziiert wird,  
> handelt es sich hier um **SolidJS-Komponenten**.  
> Astro erkennt dies automatisch anhand des Imports und Render-Contexts.

---

## 📘 Coding Guidelines (Empfohlen)

1. **Kommentare im Header jeder Datei**
   Jede Komponente sollte einen kurzen Kommentarblock enthalten:
   ```jsx
   /**
    * Component: CustomerCard
    * Framework: SolidJS
    * Type: Client Component (client:load)
    * Description: Zeigt Kundendaten im Dashboard an.
    */
   ```

2. **Imports**
   Immer mit absoluten Pfaden (Alias `~`):
   ```astro
   import CustomerCard from "~/components/core/CustomerCard.jsx";
   ```

3. **Styling**
   - Alle Styles über **TailwindCSS**
   - Keine Inline-Farben, sondern Utility-Klassen
   - Einheitliche Abstände & Kantenradius (`rounded-2xl`, `p-6`, etc.)

---

## 🧭 Strukturübersicht

```
components/core/
├── CustomerCard.jsx          # Solid-Komponente (Kundendaten)
├── ImprintCard.jsx           # Solid-Komponente (Impressum)
├── DashboardCardWide.astro   # Layout-Kachel
├── ProductGrid.astro         # Produktübersicht
├── ProductCard.astro         # Einzelne Produktkarte
├── SmartHeader.astro         # Kopfbereich
├── SmartSidebar.astro        # Seitenleiste
├── SystemMessage.astro       # Systemmeldungen
└── README.md                 # Diese Dokumentation
```

---

## 📄 Letzte Aktualisierung
- **Datum:** 03. Januar 2026  
- **Autor:** Frank Hüser  
- **Projekt:** SmartPages Dashboard  
- **Ziel:** Einheitliche Architektur für Solid & Astro Komponenten
