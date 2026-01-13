import type { MiddlewareHandler } from "astro";

/**
 * 🌐 SmartPages Verify Middleware v4.9 (Production Ready)
 * -------------------------------------------------------
 * ✅ Ruft Core Worker /api/auth/confirm auf (nicht mehr /verify)
 * ✅ Liest Session-Cookie und prüft Session-Zustand
 * ✅ Fällt zurück auf lokale KV-Prüfung (Failover)
 * ✅ Kompatibel mit SmartCore Worker v7.6 (Staging → Session → Dashboard)
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { cookies, locals } = context;
  const sessionId = cookies.get("session")?.value;

  // 🧩 Standardzustand: nicht eingeloggt
  locals.session = { loggedIn: false, email: null, lang: "de", plan: null };

  // 🔹 Kein Session-Cookie → weiter ohne Login
  if (!sessionId) return next();

  try {
    // ============================================================
    // 1️⃣  Hauptprüfung über Core Worker (/api/auth/confirm)
    // ============================================================
    const confirmUrl = `https://api.smartpages.online/api/auth/confirm?token=${encodeURIComponent(sessionId)}`;
    const res = await fetch(confirmUrl, {
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);

      if (data?.ok && data?.email) {
        locals.session = {
          loggedIn: true,
          email: data.email,
          lang: data.lang || "de",
          plan: data.plan || "trial",
        };
        return next();
      }
    }

    // ============================================================
    // 2️⃣  Fallback: Lokale KV-Session prüfen (Offline-Modus)
    // ============================================================
    const kv = locals.runtime.env?.SESSION;
    if (kv) {
      const kvData = await kv.get(sessionId);
      if (kvData) {
        const user = JSON.parse(kvData);
        locals.session = {
          loggedIn: true,
          email: user.email,
          lang: user.lang || "de",
          plan: user.plan || "trial",
        };
        return next();
      }
    }

  } catch (err) {
    console.error("❌ [middleware/verify.ts] Fehler:", err);
  }

  // 🔹 Wenn keine gültige Session gefunden → weiter ohne Login
  return next();
};
