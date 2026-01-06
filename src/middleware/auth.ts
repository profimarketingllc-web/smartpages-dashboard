import type { APIContext } from "astro";

// ✅ Cloudflare KV-Binding prüfen
const sessionStore =
  (globalThis as any).SESSION ||
  (globalThis as any).SESSIONS ||
  null;

if (!sessionStore) {
  console.error("❌ [AUTH] Kein gültiges Cloudflare KV-Binding (SESSION/SESSIONS) gefunden!");
  // Wenn das auftritt, wird der Worker bei Cloudflare mit 500 abbrechen
  // aber du bekommst jetzt im Log eine KLARE Meldung.
}

export async function onRequest(context: APIContext, next: () => Promise<Response>) {
  console.log("🟡 [AUTH] Middleware gestartet...");

  try {
    // Beispiel: Authentifizierung prüfen (Minimalversion)
    const token = context.cookies.get("sp_session_token")?.value;

    if (!token) {
      console.warn("⚠️ Kein Session-Token gefunden, leite zur Login-Seite um.");
      return context.redirect("/login");
    }

    // Optional: Session aus KV abrufen
    if (sessionStore) {
      const userData = await sessionStore.get(token);
      if (!userData) {
        console.warn("⚠️ Ungültiger oder abgelaufener Token:", token);
        return context.redirect("/login");
      }

      // ✅ Benutzerobjekt in Context speichern
      context.locals.user = JSON.parse(userData);
      console.log("✅ [AUTH] Benutzer authentifiziert:", context.locals.user.email);
    }

    // Weiter zur nächsten Middleware (lang) oder Seite
    return next();
  } catch (err) {
    console.error("❌ [AUTH] Fehler in Middleware:", err);
    return new Response("Interner Serverfehler in Auth Middleware", { status: 500 });
  }
}
