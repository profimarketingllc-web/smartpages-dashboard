import type { MiddlewareHandler } from "astro";

// 🌐 Globale Middleware für Cloudflare Pages
export const onRequest: MiddlewareHandler = async ({ request, locals, next }) => {
  try {
    const url = new URL(request.url);

    // 🧩 Debug: Ausgabe ins Log (nur während Tests)
    console.log("🌍 Middleware aktiv für:", url.pathname);

    // Beispiel: Health-Check Route für Diagnosen
    if (url.pathname === "/health") {
      return new Response("✅ Middleware & Worker laufen!", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Wenn alles okay → zum nächsten Handler weiterleiten (z. B. Seite rendern)
    const response = await next();

    // Debug-Header hinzufügen (zum schnellen Check im Browser)
    response.headers.set("x-middleware-status", "ok");
    return response;
  } catch (err: any) {
    console.error("❌ Middleware-Fehler:", err);
    return new Response(`❌ Middleware-Fehler: ${err?.message || err}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
