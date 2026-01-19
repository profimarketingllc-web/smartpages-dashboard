// src/middleware/user-session.ts
import type { MiddlewareHandler } from "astro/middleware";

/**
 * 🧠 SmartPages User Session Middleware (v6.7)
 * --------------------------------------------
 * ✅ Holt Userdaten vom Core Worker (api.smartpages.online)
 * ✅ Übergibt Cookie an Core (Session-Erkennung)
 * ✅ Setzt locals.user und locals.lang für SSR-Komponenten
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const cookieHeader = context.request.headers.get("cookie") || "";
  const hasSession = cookieHeader.includes("session=");

  if (!hasSession) {
    console.warn("[SmartPages] Keine Session im Cookie gefunden.");
    return next();
  }

  try {
    // 🔍 Userdaten über Core Worker abrufen
    const response = await fetch("https://api.smartpages.online/api/customer", {
      headers: {
        "Cookie": cookieHeader,
        "Accept": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      const json = await response.json();

      // 🔧 Unterstützt mehrere Antwortstrukturen (data, customer, user)
      const userData =
        json?.customer || json?.data || json?.user || null;

      if (userData) {
        context.locals.user = userData;
        context.locals.lang = userData.lang || "de";
        console.log("[SmartPages] ✅ locals.user gesetzt:", userData.email || userData.firstName);
      } else {
        console.warn("[SmartPages] ⚠️ Keine userData im JSON:", Object.keys(json));
      }
    } else {
      console.error("[SmartPages] ❌ Core API /api/customer Fehler:", response.status);
    }
  } catch (err) {
    console.error("[SmartPages] ❌ Middleware-Fehler beim Abrufen der Kundendaten:", err);
  }

  return next();
};
