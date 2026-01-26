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
flowchart TB

%% User pool (full width impression)
UserPool["USER · USER · USER"] 

%% Entry channels
UserPool --> HubSpot
UserPool --> Landing
UserPool --> Funnel

HubSpot["Marketing Website (HubSpot) www.smartpages.online"]
Landing["Landingpage"]
Funnel["Sales Funnel"]

%% Portal
Landing --> Portal
HubSpot --> Portal
Funnel --> Portal

Portal["SmartPages Portal Page"]

%% Public site
Portal --> Website
Website["www.smartpages.online"]

%% Core Worker
Website --> Core

Core["CORE WORKER Public API Gateway Auth Session Paywall Proxy"]

%% Internal worker system
Core -->|internal service binding| InternalSystem

subgraph InternalSystem["INTERNAL WORKER SYSTEM"]
  Customer["Customer Worker"]
  Billing["Billing Worker"]
  Mailer["Mailer Worker"]
end

%% Worker responsibilities
Customer --> R2
Billing --> Stripe
Mailer --> Resend

%% Delivery path
R2 --> Domain
Domain --> Internet

%% Infrastructure
R2["R2 Storage"]
Domain["Domain Worker Public"]
Internet["Internet DNS"]
Stripe["Stripe"]
Resend["Resend"]

%% Styling
classDef worker fill:#1E3A8A,stroke:#020617,stroke-width:3px,color:#FFFFFF
classDef workerGroup fill:#DBEAFE,stroke:#1E40AF,stroke-width:3px,color:#020617
classDef user fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E
classDef entry fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px,color:#1F2937
classDef external fill:#ECFEFF,stroke:#0891B2,stroke-width:2px,color:#083344
classDef infra fill:#F1F5F9,stroke:#475569,stroke-width:2px,color:#020617

class Core,Customer,Billing,Mailer,Domain worker
class InternalSystem workerGroup
class UserPool user
class HubSpot,Landing,Funnel,Portal,Website entry
class Stripe,Resend external
class R2,Internet infra
