import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const { request, url } = context;

    // Debug: Pfad im Cloudflare Log
    console.log("🌍 Middleware aktiv für:", url.pathname);

    // Health-Check Endpoint
    if (url.pathname === "/health") {
      return new Response("✅ Middleware & Worker laufen (Astro v5)", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Regulärer Seitenaufbau
    const response = await next();
    response.headers.set("x-middleware-status", "ok");
    return response;
  } catch (err: any) {
    console.error("❌ Middleware-Fehler:", err);
    return new Response(`❌ Middleware-Fehler: ${err?.message || err}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
});
