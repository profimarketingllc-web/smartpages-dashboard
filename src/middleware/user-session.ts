// src/middleware/user-session.ts
import type { MiddlewareHandler } from "astro/middleware";

/**
 * 🧠 SmartPages User Session Middleware (v6.8 – verified external call)
 * ---------------------------------------------------------------
 * ✅ Holt Userdaten direkt über den SmartCore Worker
 * ✅ Übergibt Cookies sauber an api.smartpages.online
 * ✅ Befüllt Astro.locals.user für serverseitige Komponenten
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const cookieHeader = context.request.headers.get("cookie") || "";
  const hasSession = cookieHeader.includes("session=");

  if (!hasSession) {
    console.warn("[SmartPages] Keine Session gefunden.");
    return next();
  }

  try {
    // 🔄 Externer API-Aufruf (NICHT relativ!)
    const response = await fetch("https://api.smartpages.online/api/customer", {
      headers: {
        "Cookie": cookieHeader,
        "Accept": "application/json",
      },
      method: "GET",
    });

    // 🔍 Response prüfen
    if (response.ok) {
      const json = await response.json();
      const userData = json?.customer || json?.data || json || null;

      if (userData) {
        context.locals.user = userData;
        context.locals.lang = userData.lang || "de";
        console.log("[SmartPages] ✅ locals.user gesetzt:", userData.email || userData.firstName);
      } else {
        console.warn("[SmartPages] ⚠️ Kein userData in Response:", Object.keys(json));
      }
    } else {
      console.error("[SmartPages] ❌ Core-API-Status:", response.status);
    }
  } catch (err) {
    console.error("[SmartPages] ❌ Fehler beim Abrufen der Kundendaten:", err);
  }

  return next();
};
