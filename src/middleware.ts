import type { MiddlewareHandler } from "astro/middleware";

/**
 * 🧩 SmartPages Middleware v5.1 (stabil)
 * ------------------------------------
 * ✅ prüft Session-Cookie nur auf geschützten Seiten
 * ✅ Login- & Redirect-Seiten bleiben frei zugänglich
 * ✅ kein Zugriff auf Core Worker nötig
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const path = context.url.pathname;

  // 🩺 Health-Check
  if (path === "/health") {
    return new Response("✅ Middleware aktiv", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 🚫 Nie blockieren bei diesen Pfaden
  if (
    path.startsWith("/api/") ||
    path.startsWith("/redirect") ||
    path.endsWith("/login") ||
    path.includes("/login") ||
    path.startsWith("/_astro/") ||
    path.startsWith("/public/") ||
    path.startsWith("/favicon")
  ) {
    return next();
  }

  // 🔐 Session prüfen nur auf geschützten Bereichen (z. B. /dashboard)
  const cookie = context.request.headers.get("cookie") || "";
  const hasSession = cookie.includes("session=");

  if (!hasSession) {
    console.warn("🚫 Keine Session – leite zum Login um");
    const lang = path.includes("/en") ? "en" : "de";
    return Response.redirect(`https://desk.smartpages.online/${lang}/login`);
  }

  // ✅ Zugriff erlaubt
  return next();
};
