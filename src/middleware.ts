import type { MiddlewareHandler } from "astro/middleware";

/**
 * 🧩 SmartPages Middleware v5.0 (stabil)
 * ------------------------------------
 * ✅ prüft nur Session-Cookie
 * ✅ greift NICHT auf Core Worker zu
 * ✅ kein doppeltes /confirm oder /verify
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const path = context.url.pathname;

  // 🚑 Healthcheck bleibt erreichbar
  if (path === "/health") {
    return new Response("✅ Middleware aktiv", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 🚫 Keine Prüfung für API oder Redirect
  if (path.startsWith("/api/") || path.startsWith("/redirect")) {
    return next();
  }

  // 🔐 Cookie prüfen
  const cookie = context.request.headers.get("cookie") || "";
  const hasSession = cookie.includes("session=");

  if (!hasSession) {
    console.warn("🚫 Keine Session, leite weiter zum Login...");
    return Response.redirect("https://desk.smartpages.online/redirect");
  }

  // ✅ Zugriff erlaubt
  return next();
};
