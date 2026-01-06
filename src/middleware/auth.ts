import type { APIContext } from "astro";

// 🚀 Debug Start — Worker läuft
console.log("🚀 [AUTH] Middleware geladen (Worker aktiv).");

// 🌐 Anzeigen, welche globalen Variablen im Cloudflare Worker existieren
console.log("🌐 [ENV CHECK] Global Bindings:", Object.keys(globalThis));

// ✅ Cloudflare KV-Binding prüfen
const sessionStore =
  (globalThis as any).SESSION ||
  (globalThis as any).SESSIONS ||
  null;

if (!sessionStore) {
  console.error("❌ [AUTH] Kein gültiges Cloudflare KV-Binding (SESSION/SESSIONS) gefunden!");
  // Wir werfen hier KEINEN harten Fehler mehr, um weitere Logs sehen zu können.
}

export async function onRequest(context: APIContext, next: () => Promise<Response>) {
  console.log("🟡 [AUTH] Middleware gestartet…");

  try {
    // 🔍 Token aus Cookie lesen
    const token = context.cookies.get("sp_session_token")?.value;

    if (!token) {
      console.warn("⚠️ [AUTH] Kein Session-Token gefunden, leite zu /login um");
      return context.redirect("/login");
    }

    // 💾 Session aus KV abrufen (wenn vorhanden)
    if (sessionStore) {
      console.log("🔍 [AUTH] Versuche Session aus Cloudflare KV zu laden…");
      const userData = await sessionStore.get(token);

      if (!userData) {
        console.warn("⚠️ [AUTH] Ungültiger oder abgelaufener Token:", token);
        return context.redirect("/login");
      }

      // ✅ Benutzerobjekt im Context speichern
      context.locals.user = JSON.parse(userData);
      console.log("✅ [AUTH] Benutzer authentifiziert:", context.locals.user.email);
    } else {
      console.warn("⚠️ [AUTH] Kein KV-Store verfügbar, Authentifizierung übersprungen.");
    }

    // 🧩 Weiter zur nächsten Middleware (lang) oder Seite
    return next();

  } catch (err) {
    // 💥 Vollständiger Fehlerausdruck für Cloudflare Logs
    console.error("💥 [AUTH] Vollständiger Fehler-Stack:", err);

    return new Response("Interner Serverfehler in Auth Middleware", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
