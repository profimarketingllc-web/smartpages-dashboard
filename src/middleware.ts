import type { MiddlewareHandler } from "astro/middleware";
import { onRequest as userSessionMiddleware } from "./middleware/user-session";

/**
 * 🧩 SmartPages Middleware v6.4
 * ------------------------------
 * ✅ prüft Session-Cookie nur auf geschützten Seiten
 * ✅ lädt Sessiondaten direkt aus KV über user-session.ts
 * ✅ Login- & Redirect-Seiten bleiben frei zugänglich
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

  // 🔐 Session prüfen
  const cookie = context.request.headers.get("cookie") || "";
  const hasSession = cookie.includes("session=");

  if (!hasSession) {
    console.warn("🚫 Keine Session – leite zum Login um");
    const lang = path.includes("/en") ? "en" : "de";
    return Response.redirect(`https://desk.smartpages.online/${lang}/login`);
  }

  // 🧠 Userdaten aus KV lesen
  await userSessionMiddleware(context, async () => {});

  // ✅ Zugriff erlaubt
  return next();
};
