import type { MiddlewareHandler } from "astro";

/**
 * 🌐 SmartPages Verify Middleware v4.8 FINAL (API AUTH)
 * ---------------------------------------------------
 * ✅ Prüft Session-Cookie über Core Worker (/api/auth/verify)
 * ✅ Fällt zurück auf lokale KV-Prüfung (Failover)
 * ✅ Setzt locals.session (SSR-kompatibel)
 * ✅ Kein doppelter /verify-Request mehr
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { cookies, locals } = context;
  const sessionId = cookies.get("session")?.value;

  // Standardzustand: nicht eingeloggt
  locals.session = { loggedIn: false, email: null, lang: "de", plan: null };

  if (!sessionId) return next();

  try {
    // 🔹 1. Versuch: Neue Core Worker Verification
    const verifyUrl = `https://api.smartpages.online/api/auth/verify?token=${encodeURIComponent(sessionId)}`;
    const res = await fetch(verifyUrl, { headers: { Accept: "application/json" } });

    if (res.ok) {
      const data = await res.json();
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

    // 🔹 2. Fallback: Lokale KV-Abfrage (z. B. bei Offline-Betrieb)
    const kv = locals.runtime.env.SESSION;
    const kvData = await kv.get(sessionId);

    if (kvData) {
      const user = JSON.parse(kvData);
      locals.session = {
        loggedIn: true,
        email: user.email,
        lang: user.lang,
        plan: user.plan,
      };
      return next();
    }
  } catch (err) {
    console.error("❌ [middleware/verify.ts] Fehler:", err);
  }

  return next();
};
