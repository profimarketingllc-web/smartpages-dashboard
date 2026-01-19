// src/middleware/user-session.ts
import type { MiddlewareHandler } from "astro/middleware";

/**
 * 🧠 User-Session Middleware (v6.6 – Production Fix)
 * --------------------------------------------------
 * ✅ Holt Userdaten über SmartCore Proxy (api.smartpages.online)
 * ✅ Nutzt Cookie für Session-Identifikation
 * ✅ Befüllt locals.user für Templates (z. B. SystemMessage)
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const cookie = context.request.headers.get("cookie") || "";
  const hasSession = cookie.includes("session=");

  if (!hasSession) {
    // Keine Session → neutral fortsetzen (z. B. Login-Seite)
    return next();
  }

  try {
    // 🔄 Anfrage an Core Worker (Proxy zu Customer)
    const res = await fetch(`https://api.smartpages.online/api/customer`, {
      headers: {
        "Cookie": cookie,
        "Accept": "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      // 🧩 Kundendaten in Locals speichern
      context.locals.user = data?.customer || data?.data || null;
    } else {
      console.warn(`[SmartPages] ⚠️ Core API /api/customer → ${res.status}`);
    }
  } catch (err) {
    console.error("[SmartPages] ❌ Fehler beim Abrufen der Kundendaten:", err);
  }

  return next();
};
