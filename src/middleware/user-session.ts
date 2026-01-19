import type { MiddlewareHandler } from "astro/middleware";

/**
 * 🧠 User-Session Middleware (v7.0)
 * --------------------------------------------------
 * ✅ Holt Userdaten über SmartCore-Endpunkt /api/session/userinfo
 * ✅ Keine interne Worker-Verbindung erforderlich
 * ✅ Befüllt locals.user und locals.lang für alle Templates
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const cookie = context.request.headers.get("cookie") || "";
  const hasSession = cookie.includes("session=");

  if (!hasSession) {
    // Kein Cookie → kein Login
    return next();
  }

  try {
    // 🌐 Neue API-Abfrage über SmartCore
    const res = await fetch("https://api.smartpages.online/api/session/userinfo", {
      method: "GET",
      headers: {
        Cookie: cookie,
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const json = await res.json();
      const user = json?.user || null;

      if (user) {
        context.locals.user = user;
        context.locals.lang = user.language || user.lang || "de";
      } else {
        console.warn("[SmartPages] ⚠️ Kein Userobjekt erhalten:", json);
      }
    } else {
      console.warn(`[SmartPages] ⚠️ Session UserInfo Fehler (${res.status})`);
    }
  } catch (err) {
    console.error("❌ Fehler beim Abrufen der Userdaten:", err);
  }

  return next();
};
