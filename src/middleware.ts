import { sequence } from "astro:middleware";
import { onRequest as lang } from "./middleware/lang";
// import { onRequest as auth } from "./middleware/auth"; // später aktivieren

// 🚀 Haupt-Middleware-Kette
export const onRequest = sequence(lang, async (context, next) => {
  try {
    // Health-Check
    if (context.url.pathname === "/health") {
      return new Response("✅ Middleware & Worker laufen (Astro v5 sequence)", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Weiter zum eigentlichen Render-Prozess
    const response = await next();
    response.headers.set("x-middleware-sequence", "ok");
    return response;
  } catch (err: any) {
    return new Response(`❌ Middleware-Fehler: ${err?.message || err}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
});
