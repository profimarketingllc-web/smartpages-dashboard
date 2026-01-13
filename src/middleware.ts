import { sequence, type MiddlewareHandler } from "astro/middleware";
import { onRequest as lang } from "./middleware/lang";
// ✅ Neuer Pfad: verify.ts liegt jetzt unter src/pages/api/auth/
import { onRequest as verify } from "./pages/api/auth/verify";

/**
 * 🌐 SmartPages Middleware Router v4.8 (Production Ready)
 * -------------------------------------------------------
 * - Health Check (schneller Response auf /health)
 * - Sprach- und Sessionprüfung (lang + verify)
 * - Vollständig kompatibel mit Astro v5 + Cloudflare Adapter
 * - Robuste Fehlerbehandlung und Header-Tracking
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  // ✅ 1️⃣ Health Check Endpoint
  if (context.url.pathname === "/health") {
    return new Response("✅ SmartPages Middleware aktiv (Astro v5)", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // ✅ 2️⃣ Middleware-Kette (Lang → Verify)
  const chain = sequence(lang, verify);

  try {
    const response = await chain(context, next);
    response.headers.set("x-middleware-sequence", "ok");
    return response;
  } catch (err: any) {
    console.error("❌ Middleware-Fehler:", err);

    return new Response(
      `❌ Middleware-Fehler: ${err?.message || "Unbekannt"}`,
      {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  }
};
