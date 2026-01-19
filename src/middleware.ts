import type { MiddlewareHandler } from "astro/middleware";
import { onRequest as userSessionMiddleware } from "@middleware/user-session";

/**
 * 🧩 SmartPages Combined Middleware v6.5
 * -------------------------------------
 * ✅ Einheitliche Middleware für alle Seiten
 * ✅ Prüft Session, lädt Userdaten aus KV
 * ✅ Führt Weiterleitungen aus (Login etc.)
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  const path = context.url.pathname;

  // 🩺 Health Check (funktioniert wie gehabt)
  if (path === "/health") {
    return new Response("✅ Middleware aktiv", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 🚫 Nie blockieren bei öffentlichen Pfaden
  if (
    path.startsWith("/api/") ||
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

  // 🧠 Userdaten aus KV via user-session.ts laden
  await userSessionMiddleware(context, async () => {});

  // ✅ Zugriff erlaubt
  return next();
};
