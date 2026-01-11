// ============================================================
// 🌟 SmartPages Middleware – Auth v4.6 (Core 4.6 kompatibel)
// ============================================================
// Zweck:
//   ✅ Prüft Session-Cookie über Core Worker (/verify)
//   ✅ Setzt locals.session (SSR)
//   ✅ Fehlertolerant & SSR-sicher
// ============================================================

import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { cookies, locals } = context;
  const sessionId = cookies.get("session")?.value;

  // Default Session-Status
  locals.session = { loggedIn: false, email: null, lang: "de", products: [] };

  // Kein Session Cookie → direkt weiter
  if (!sessionId) return await next();

  try {
    // Prüfen über Core Worker
    const verifyRes = await fetch(
      `https://api.smartpages.online/verify?token=${encodeURIComponent(sessionId)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!verifyRes.ok) {
      console.warn("Session verification failed:", verifyRes.status);
      return await next();
    }

    const data = await verifyRes.json();
    if (data?.ok && data?.email) {
      locals.session = {
        loggedIn: true,
        email: data.email,
        lang: data.lang || "de",
        products: data.products || [],
      };
    }
  } catch (err) {
    console.error("❌ Middleware Auth Error:", err);
  }

  return await next();
};
