import { sequence } from "astro/middleware";
import { onRequest as lang } from "./middleware/lang";
import { onRequest as verify } from "./middleware/verify";

/**
 * 🌐 SmartPages Middleware Router v4.7 FINAL
 * - Health Check
 * - Sprach- und Sessionprüfung (lang + verify)
 * - Stabile Fehlerbehandlung
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  // ✅ 1️⃣ Health Check
  if (context.url.pathname === "/health") {
    return new Response("✅ Worker & Middleware aktiv (Astro v5)", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // ✅ 2️⃣ Middleware-Kette: Sprache → Session
  const chain = sequence(lang, verify);

  try {
    const response = await chain(context, next);
    response.headers.set("x-middleware-sequence", "ok");
    return response;
  } catch (err: any) {
    console.error("❌ Middleware-Fehler:", err);
    return new Response(`❌ Middleware-Fehler: ${err?.message || "Unbekannt"}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
};
