# SmartPages – Worker Architecture (EN)

> **Purpose of this document**  
> High-level overview of the SmartPages system architecture with a focus on **structure, security, and responsibilities**.  
> This document describes the **architecture**, not individual products or features.

---

## Architecture Overview

- Two **public entry points** with clearly separated responsibilities
- **Core Worker** acting as the central control plane and API gateway
- Specialized workers are **not publicly accessible**
- **Domain Worker** as a dedicated edge delivery layer
- Shared infrastructure for state and assets

---

## Diagram

```mermaid
flowchart LR

%% Entry Points
HubSpot[Marketing Website HubSpot] --> Frontend[SmartPages Frontend Astro Pages]

Frontend --> Core[Core Worker Public API Gateway Auth Session Paywall Proxy Middleware]

%% Core-controlled workers (internal)
Core -. internal_service_binding .-> Customer[Customer Worker Profiles Pages Links]
Core -. internal_service_binding .-> Billing[Billing Worker Stripe Subscriptions]
Core -. internal_service_binding .-> Mailer[Mailer Worker Resend System Mails]

%% Shared infrastructure
Customer --> R2[R2 Bucket Customer Pages]
Customer --> D1[D1 User and Product State]
Core --> KV[KV Sessions Tokens]

%% Domain Worker (separate public entry)
R2 --> Domain[Domain Worker Public Edge Delivery Custom Domains HTTP]
Domain --> Internet[Internet DNS]

%% External services
Billing --> Stripe[Stripe]
Mailer --> Resend[Resend]
