# SmartPages – Worker Architektur (DE)

> **Zweck dieses Dokuments**  
> Übersicht der SmartPages-Systemarchitektur mit Fokus auf **Struktur, Sicherheit und Verantwortlichkeiten**.  
> Dieses Dokument beschreibt die **Architektur**, nicht einzelne Produkte oder Features.

---

## Architektur-Überblick

- Zwei **öffentliche Entry Points** mit klar getrennten Verantwortlichkeiten
- **Core Worker** als zentrale Control Plane und API-Gateway
- Spezialisierte Worker sind **nicht öffentlich erreichbar**
- **Domain Worker** als dedizierte Edge-Delivery-Schicht
- Gemeinsame Infrastruktur für State und Assets

---

## Diagramm

```mermaid
flowchart LR

%% Entry Points
HubSpot[Marketing Website HubSpot] --> Frontend[SmartPages Frontend Astro Pages]

Frontend --> Core[Core Worker Public API Gateway Auth Session Paywall Proxy Middleware]

%% Core-gesteuerte Worker (intern)
Core -. internal_service_binding .-> Customer[Customer Worker Profiles Pages Links]
Core -. internal_service_binding .-> Billing[Billing Worker Stripe Subscriptions]
Core -. internal_service_binding .-> Mailer[Mailer Worker Resend System Mails]

%% Gemeinsame Infrastruktur
Customer --> R2[R2 Bucket Customer Pages]
Customer --> D1[D1 User and Product State]
Core --> KV[KV Sessions Tokens]

%% Domain Worker (separater öffentlicher Einstieg)
R2 --> Domain[Domain Worker Public Edge Delivery Custom Domains HTTP]
Domain --> Internet[Internet DNS]

%% Externe Dienste
Billing --> Stripe[Stripe]
Mailer --> Resend[Resend]
