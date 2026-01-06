import type { APIContext } from "astro";

export async function onRequest(context: APIContext, next: () => Promise<Response>) {
  console.log("🧩 [AUTH] Middleware gestartet");

  try {
    // Cloudflare KV Binding prüfen
    const kv =
      (globalThis as any).SESSION ||
      (globalThis as any).SESSIONS ||
      (context.locals?.SESSION as any) ||
      null;

    if (!kv) {
      console.error("❌ [AUTH] Kein KV-Binding gefunden (SESSION/SESSIONS).");
      return new Response("Fehler: Kein Cloudflare KV-Binding gefunden (SESSION).", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    console.log("✅ [AUTH] KV gefunden:", kv.constructor?.name || typeof kv);

    // Beispiel: Testeintrag schreiben/lesen
    await kv.put("debug-test", "ok", { expirationTtl: 60 });
    const value = await kv.get("debug-test");
    console.log("📦 [AUTH] KV-Testwert:", value);

    // Wenn alles gut: Anfrage normal weitergeben
    return next();
  } catch (err: any) {
    console.error("🔥 [AUTH] Laufzeitfehler in auth.ts:", err?.message || err);
    return new Response("Interner Fehler: " + (err?.message || err), {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
