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
HubSpot[Marketing Website<br/>(HubSpot)] --> Frontend[SmartPages Frontend<br/>(Astro / Pages)]

Frontend --> Core[Core Worker<br/><b>Public API Gateway</b><br/>Auth · Session · Paywall · Proxy<br/>(Middleware)]

%% Core-controlled workers (internal)
Core -. internal service binding .-> Customer[Customer Worker<br/>Profiles · Pages · Links]
Core -. internal service binding .-> Billing[Billing Worker<br/>Stripe · Subscriptions]
Core -. internal service binding .-> Mailer[Mailer Worker<br/>Resend · System Mails]

%% Shared infrastructure
Customer --> R2[R2 Bucket<br/>Customer Pages]
Customer --> D1[D1<br/>User & Product State]
Core --> KV[KV<br/>Sessions / Tokens]

%% Domain Worker (separate public entry)
R2 --> Domain[Domain Worker<br/><b>Public Edge Delivery</b><br/>Custom Domains · HTTP]
Domain --> Internet[Internet / DNS]

%% External services
Billing --> Stripe[Stripe]
Mailer --> Resend[Resend]
```

---

## Security & Access Model

- The **Core Worker** is the only public entry point for application logic and APIs
- All specialized workers (**Customer, Billing, Mailer**) are reachable **only via internal service bindings**
- The **Domain Worker** is a separate public entry point limited to static edge delivery
- There is **no direct communication** between the Domain Worker and internal workers

---

## Architectural Principles

- Reduced attack surface through centralized access control
- Clear separation of control plane (Core) and delivery plane (Domain)
- Single responsibility per worker
- Architecture maintained as a **living document** evolving with the system

---

**Status:** Final · Reference architecture for SmartPages

