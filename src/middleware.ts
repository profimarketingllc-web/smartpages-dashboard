import { sequence } from "astro/middleware";
import { onRequest as lang } from "./middleware/lang";
import { onRequest as auth } from "./middleware/auth";

// 🚀 Haupt-Middleware-Kette (eine einzige export const!)
export const onRequest = sequence(
  lang,
  auth,
  async (context, next) => {
    try {
      // 🔍 Health-Check direkt hier behandeln
      if (context.url.pathname === "/health") {
        return new Response("✅ Middleware & Worker laufen (Astro v5 sequence)", {
          status: 200,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      // 🚦 Weiter zum nächsten Middleware-Schritt oder zur Seite
      const response = await next();

      // Optionale Debug-Header (z. B. für Cloudflare Monitoring)
      response.headers.set("x-middleware-sequence", "ok");
      return response;
    } catch (err: any) {
      return new Response(`❌ Middleware-Fehler: ${err?.message || err}`, {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }
);
