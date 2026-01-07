import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ cookies, locals, env, request, next }) => {
  try {
    const sessionId = cookies.get("session_id")?.value;

    // 🚧 Kein Session-Binding vorhanden?
    if (!env.SESSION && !env.DB) {
      console.warn("⚠️ Kein KV oder D1 Binding verfügbar, verwende Dummy-Session.");
      locals.session = { user_id: null, guest: true };
      return next();
    }

    // 🔐 Kein Session-Cookie → Gastmodus
    if (!sessionId) {
      locals.session = { user_id: null, guest: true };
      return next();
    }

    // 🗝️ Versuch, Session aus KV zu laden
    const session = await env.SESSION?.get(sessionId, { type: "json" });

    if (!session?.user_id) {
      locals.session = { user_id: null, guest: true };
      return next();
    }

    // ✅ Session erfolgreich geladen
    locals.session = session;
  } catch (err) {
    console.error("❌ [AUTH] Middleware-Fehler:", err);
    locals.session = { user_id: null, guest: true };
  }

  return next();
};
