import type { MiddlewareHandler } from "astro";

/**
 * 🧩 SmartPages Verify Middleware v5.0 (SSR-kompatibel)
 * -----------------------------------------------------
 * ✅ Prüft Session über Core Worker (/api/auth/confirm)
 * ✅ Leitet Cookie-Header korrekt weiter (SSR!)
 * ✅ Fällt zurück auf lokale KV-Prüfung bei Offline/Timeout
 * ✅ Setzt locals.session für SSR & CSR
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { cookies, locals, request } = context;
  const sessionId = cookies.get("session")?.value;

  // Standardzustand
  locals.session = {
    loggedIn: false,
    email: null,
    lang: "de",
    plan: null,
  };

  // Ohne Session → keine Prüfung nötig
  if (!sessionId) return next();

  try {
    // 🔹 SSR-sicherer Cookie-Header
    const cookieHeader = request.headers.get("cookie") || "";

    // 🔹 Anfrage an Core Worker mit Cookie-Forwarding
    const res = await fetch("https://api.smartpages.online/api/auth/confirm", {
      headers: {
        cookie: cookieHeader, // <-- wichtig für SSR
        Accept: "application/json",
      },
      credentials: "include",
    });

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

    // 🔹 Fallback: Lokale KV prüfen (Failover-Modus)
    const kv = locals.runtime.env?.SESSION;
    const kvData = await kv?.get(sessionId, { type: "json" });

    if (kvData?.email) {
      locals.session = {
        loggedIn: true,
        email: kvData.email,
        lang: kvData.lang || "de",
        plan: kvData.plan || "trial",
      };
    }
  } catch (err) {
    console.error("❌ Verify-Fehler (SSR):", err);
  }

  return next();
};
