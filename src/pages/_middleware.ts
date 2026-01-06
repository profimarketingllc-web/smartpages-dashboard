import type { APIContext } from "astro";

// 🧭 Diese Middleware wird garantiert in Cloudflare Pages ausgeführt
export async function onRequest(context: APIContext, next: () => Promise<Response>) {
  try {
    console.log("🪶 [GLOBAL MIDDLEWARE] Start");

    const kv =
      (globalThis as any).SESSION ||
      (globalThis as any).SESSIONS ||
      (context.locals?.SESSION as any) ||
      null;

    if (!kv) {
      console.error("❌ Kein Cloudflare KV-Binding (SESSION) verfügbar.");
      return new Response("Fehler: Kein Cloudflare KV-Binding (SESSION).", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Testschreiben in KV
    await kv.put("test-key", "ok", { expirationTtl: 60 });
    const testVal = await kv.get("test-key");

    console.log("✅ KV-Binding aktiv:", testVal);
    return next();
  } catch (err: any) {
    console.error("🔥 Middleware-Fehler:", err?.message || err);
    return new Response("Interner Fehler in _middleware.ts: " + (err?.message || err), {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
