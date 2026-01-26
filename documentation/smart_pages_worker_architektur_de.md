# SmartPages – Worker Architektur (DE)

> **Ziel dieses Dokuments**  
> Übersicht der SmartPages-Systemarchitektur mit Fokus auf **Struktur, Sicherheit und Zuständigkeiten**.  
> Dieses Dokument beschreibt die **Architektur**, nicht einzelne Produkte oder Features.

---

## Architektur-Überblick

- Zwei **öffentliche Entry Points** mit klar getrennten Rollen
- **Core Worker** als zentrales Gateway (Control Plane)
- Spezialisierte Worker sind **nicht öffentlich erreichbar**
- **Domain Worker** als separate Edge-Delivery-Schicht
- Gemeinsame Infrastruktur für State und Assets

---

## Diagramm

```mermaid
flowchart LR

%% Entry Points
HubSpot[Marketing Website<br/>(HubSpot)] --> Frontend[SmartPages Frontend<br/>(Astro / Pages)]

Frontend --> Core[Core Worker<br/><b>Öffentliches API-Gateway</b><br/>Auth · Session · Paywall · Proxy<br/>(Middleware)]

%% Core-gesteuerte Worker (intern)
Core -. interne Dienstbindung .-> Customer[Customer Worker<br/>Profile · Pages · Links]
Core -. interne Dienstbindung .-> Billing[Billing Worker<br/>Stripe · Subscriptions]
Core -. interne Dienstbindung .-> Mailer[Mailer Worker<br/>Resend · System-Mails]

%% Gemeinsame Infrastruktur
Customer --> R2[R2 Bucket<br/>Kunden-Pages]
Customer --> D1[D1<br/>User- & Produkt-Status]
Core --> KV[KV<br/>Sessions / Tokens]

%% Domain Worker (separater öffentlicher Zugang)
R2 --> Domain[Domain Worker<br/><b>Öffentliche Edge-Auslieferung</b><br/>Custom Domains · HTTP]
Domain --> Internet[Internet / DNS]

%% Externe Dienste
Billing --> Stripe[Stripe]
Mailer --> Resend[Resend]
```

---

## Sicherheits- & Zugriffsmodell

- Der **Core Worker** ist der einzige öffentliche Einstiegspunkt für Anwendungslogik und APIs
- Alle spezialisierten Worker (**Customer, Billing, Mailer**) sind **ausschließlich intern** über Service-Bindings erreichbar
- Der **Domain Worker** ist ein separater öffentlicher Einstiegspunkt und auf die Auslieferung statischer Inhalte beschränkt
- Es existiert **keine direkte Kommunikation** zwischen Domain Worker und internen Workern

---

## Architekturprinzipien

- Minimierte Angriffsfläche durch zentrale Zugangskontrolle
- Klare Trennung von Control Plane (Core) und Delivery Plane (Domain)
- Single Responsibility pro Worker
- Architektur als **Living Document**, das mit dem System wächst

---

**Status:** Final · Referenzarchitektur für SmartPages

