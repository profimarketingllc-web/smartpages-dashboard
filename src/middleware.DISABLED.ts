import { sequence } from "astro/middleware";
import { onRequest as userSession } from "./middleware/user-session";
import { onRequest as lang } from "./middleware/lang";

/**
 * 🧩 SmartPages Combined Middleware v7.1
 * -------------------------------------
 * ✅ Lädt Userdaten aus Core (/api/session/userinfo)
 * ✅ Prüft Session-Cookie
 * ✅ Führt Weiterleitungen aus
 * ✅ Voll kompatibel mit Cloudflare Pages Runtime
 */

export const onRequest = sequence(
  // 1️⃣ Userdaten vor allen anderen Routen laden
  userSession,

  // 2️⃣ Sprachauswahl setzen
  lang,

  // 3️⃣ Hauptlogik (Session prüfen, öffentliche Pfade)
  async (context, next) => {
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

    // ✅ Wenn Session existiert → Userdaten schon in locals gesetzt
    return next();
  }
);
