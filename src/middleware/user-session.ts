import type { MiddlewareHandler } from "astro/middleware";

/**
 * 🧠 User-Session Middleware (v7.1)
 * --------------------------------------------------
 * ✅ Ruft den SmartCore-Endpunkt /api/session/userinfo auf
 * ✅ Liest Userdaten aus gültiger Session
 * ✅ Speichert sie in locals.user und locals.lang
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const cookie = context.request.headers.get("cookie") || "";
  if (!cookie.includes("session=")) {
    return next();
  }

  try {
    const res = await fetch("https://api.smartpages.online/api/session/userinfo", {
      headers: {
        Cookie: cookie,
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.ok && json.user) {
        context.locals.user = json.user;
        context.locals.lang = json.user.language || "de";
        console.log("[SmartPages] ✅ Userdaten in locals gesetzt:", json.user.email);
      } else {
        console.warn("[SmartPages] ⚠️ Keine gültigen Userdaten:", json);
      }
    } else {
      console.warn("[SmartPages] ⚠️ Session UserInfo Fehler:", res.status);
    }
  } catch (err) {
    console.error("[SmartPages] ❌ Fehler in user-session Middleware:", err);
  }

  return next();
};
