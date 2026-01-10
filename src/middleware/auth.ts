// ============================================================
// 🧩 SmartPages AUTH Middleware – Gold Build v3.6
// ============================================================
// Zweck:
//   ✅ Prüft das "session"-Cookie gegen den Core Worker
//   ✅ Lädt Benutzerinformationen aus der API
//   ✅ Setzt locals.session (für alle Server-Routes verfügbar)
//   ✅ Kompatibel mit Cloudflare + Astro Middleware Stack
// ============================================================

import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { cookies, locals, request } = context;

  try {
    // 1️⃣ Session-Cookie abrufen
    const sessionToken = cookies.get("session")?.value;

    // 🚫 Kein Token → Gastmodus aktiv
    if (!sessionToken) {
      locals.session = { loggedIn: false, email: null, products: [] };
      return await next();
    }

    // 2️⃣ Session gegen Core Worker prüfen
    const verifyUrl = `https://api.smartpages.online/api/auth/verify?token=${encodeURIComponent(
      sessionToken
    )}`;
    const verifyRes = await fetch(verifyUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    // ❌ Kein Erfolg → Cookie löschen und Gastmodus
    if (!verifyRes.ok) {
      console.warn("⚠️ Ungültiges oder abgelaufenes Token, Cookie wird entfernt.");
      cookies.delete("session", { path: "/" });
      locals.session = { loggedIn: false, email: null, products: [] };
      return await next();
    }

    // ✅ Erfolgreiche Validierung
    const data = await verifyRes.json();

    // Sicherheitsprüfung der Response
    if (data?.ok && data?.email) {
      locals.session = {
        loggedIn: true,
        email: data.email,
        products: data.products || [],
        verifiedAt: Date.now(),
      };
    } else {
      locals.session = { loggedIn: false, email: null, products: [] };
    }
  } catch (err) {
    console.error("❌ Middleware Auth Error:", err);
    locals.session = { loggedIn: false, email: null, products: [] };
  }

  // 3️⃣ Anfrage fortsetzen
  return await next();
};
