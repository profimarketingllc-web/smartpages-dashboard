import type { APIContext } from "astro";

export async function onRequest(context: APIContext, next: () => Promise<Response>) {
  try {
    // Testausgabe
    return new Response("✅ Cloudflare Worker läuft und Middleware wurde geladen.", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err: any) {
    return new Response("❌ Fehler in _middleware.ts: " + (err?.message || err), {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
