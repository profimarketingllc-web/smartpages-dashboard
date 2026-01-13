/**
 * SmartPages Core API – Endpunktübersicht (v7.5)
 * -------------------------------------------------
 * Diese Datei wird automatisch vom Core Worker aktualisiert.
 * Sie enthält alle aktiven Endpunkte mit Beschreibung und Methoden.
 */

export interface RouteDefinition {
  path: string;
  method: string[];
  description: string;
  category: "auth" | "session" | "customer" | "system";
}

export const ROUTES: RouteDefinition[] = [
  // AUTH
  {
    path: "/api/auth/start",
    method: ["POST"],
    description: "Magic Link anfordern und Token generieren",
    category: "auth",
  },
  {
    path: "/api/auth/verify",
    method: ["GET"],
    description: "Token prüfen und in Staging speichern",
    category: "auth",
  },
  {
    path: "/api/auth/confirm",
    method: ["GET"],
    description: "Token aus Staging bestätigen und Session erstellen",
    category: "auth",
  },
  {
    path: "/api/auth/logout",
    method: ["GET"],
    description: "Session beenden und Cookie löschen",
    category: "auth",
  },

  // SESSION
  {
    path: "/api/session/check",
    method: ["GET"],
    description: "Session-Status abfragen",
    category: "session",
  },

  // CUSTOMER
  {
    path: "/api/customer/profile",
    method: ["GET"],
    description: "Kundendaten abrufen (Proxy zu Customer API)",
    category: "customer",
  },
  {
    path: "/api/customer/imprint",
    method: ["GET"],
    description: "Impressumsdaten abrufen (Proxy zu Customer API)",
    category: "customer",
  },
  {
    path: "/api/customer/*",
    method: ["GET", "POST"],
    description: "Weitere Customer-Endpunkte (automatisch durchgereicht)",
    category: "customer",
  },

  // SYSTEM
  {
    path: "/ping",
    method: ["GET"],
    description: "Healthcheck für Core Worker",
    category: "system",
  },
];

/**
 * Gibt alle Routen in einem flachen Objekt zurück
 * – z. B. für Logs, Dokumentation oder Monitoring.
 */
export const ROUTE_MAP = ROUTES.reduce((acc, r) => {
  acc[r.path] = { method: r.method, category: r.category };
  return acc;
}, {} as Record<string, { method: string[]; category: string }>);

export default ROUTES;
