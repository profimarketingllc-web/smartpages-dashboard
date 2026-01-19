// src/middleware/user-session.ts
import type { MiddlewareHandler } from "astro/middleware";

/**
 * SmartPages User Session Middleware (v7.0)
 * ------------------------------------------
 * Holt Nutzerdaten über den SmartCore-Proxy.
 * Erkennt Session-Cookies, ruft API-Host extern auf,
 * und befüllt Astro.locals.user + Astro.locals.lang.
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  const cookieHeader = context.request.headers.get("cookie") || "";
  const hasSession = cookieHeader.includes("session=");

  if (!hasSession) {
    return next();
  }

  try {
    const apiUrl = "https://api.smartpages.online/api/customer";

    const response = await fetch(apiUrl, {
      headers: {
        "Cookie": cookieHeader,
        "Accept": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      const json = await response.json();
      const userData = json?.data || json?.customer || null;

      if (userData) {
        context.locals.user = userData;
        context.locals.lang = userData.language || "de";
        console.log("[SmartPages] ✅ user-session Middleware aktiv:", userData.email);
      } else {
        console.warn("[SmartPages] ⚠️ Keine userData im JSON:", Object.keys(json));
      }
    } else {
      console.error("[SmartPages] ❌ Core Worker Antwort:", response.status);
    }
  } catch (err) {
    console.error("[SmartPages] ❌ Middleware-Fehler:", err);
  }

  return next();
};
