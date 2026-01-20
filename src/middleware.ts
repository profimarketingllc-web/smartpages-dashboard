import { sequence } from "astro/middleware";
import { onRequest as userSession } from "./middleware/user-session";

/**
 * 🧩 SmartPages Combined Middleware v7.0
 * -------------------------------------
 * ✅ Lädt Userdaten über Core (/api/session/userinfo)
 * ✅ Prüft Session & leitet ggf. auf Login
 * ✅ Läuft vollständig im Astro Context (locals bleiben erhalten)
 */

export const onRequest = sequence(userSession, async (context, next) => {
  const path = context.url.pathname;

  // 🩺 Health Check
  if (path === "/health") {
    return new Response("✅ Middleware aktiv", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 🚫 Öffentliche Pfade überspringen
  if (
    path.startsWith("/api/") ||
    path.startsWith("/debug") ||
    path.includes("/login") ||
    path.startsWith("/redirect") ||
    path.startsWith("/_astro/") ||
    path.startsWith("/public/") ||
    path.startsWith("/favicon")
  ) {
    return next();
  }

  // 🔐 Session prüfen
  const cookie = context.request.headers.get("cookie") || "";
  const hasSession = cookie.includes("session=");

  if (!hasSession) {
    console.warn("🚫 Keine Session – leite zum Login um");
    const lang = path.includes("/en") ? "en" : "de";
    return Response.redirect(`https://desk.smartpages.online/${lang}/login`);
  }

  // ✅ Zugriff erlaubt → Userdaten bereits durch userSession gesetzt
  return next();
});
