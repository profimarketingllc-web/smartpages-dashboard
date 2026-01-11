// ============================================================
// 🌟 SmartPages Middleware – Auth (v4.0 Core kompatibel)
// ============================================================
// Liest das session-Cookie, validiert es über den Core Worker,
// und speichert den Login-Status in locals.session.
// ============================================================

import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { cookies, locals } = context;
  const sessionId = cookies.get("session")?.value;

  // 🧩 Standardstatus (nicht eingeloggt)
  locals.session = { loggedIn: false, email: null, products: [] };

  if (!sessionId) {
    return await next();
  }

  try {
    // 🔍 Core Worker prüfen lassen
    const verifyRes = await fetch(`https://api.smartpages.online/verify?token=${sessionId}`, {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  redirect: "manual", // verhindert 302-Follow
});

    if (!verifyRes.ok) {
      console.warn("Session verification failed:", verifyRes.status);
      return await next();
    }

    const data = await verifyRes.json();
    if (data?.ok && data?.email) {
      locals.session = {
        loggedIn: true,
        email: data.email,
        lang: data.lang,
        products: data.products,
      };
    }
  } catch (err) {
    console.error("❌ Middleware Auth Error:", err);
  }

  return await next();
};
