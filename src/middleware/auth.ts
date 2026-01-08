// ============================================================
// Middleware: Authentifizierung über SmartCore Worker
// ============================================================

import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { cookies, locals } = context;

  try {
    // 🔎 Session-Cookie abrufen
    const sessionId = cookies.get("session")?.value;

    // 🧩 Kein Cookie = Gastmodus
    if (!sessionId) {
      locals.session = { loggedIn: false, email: null };
      return await next();
    }

    // 🚀 Session über Core Worker prüfen
    const verifyRes = await fetch("https://api.smartpages.online/api/session/verify", {
      method: "GET",
      headers: {
        Cookie: `session=${sessionId}`,
        Accept: "application/json",
      },
      credentials: "include",
    });

    // ❌ Kein Erfolg → Gastmodus
    if (!verifyRes.ok) {
      locals.session = { loggedIn: false, email: null };
      return await next();
    }

    // ✅ Session erfolgreich validiert
    const data = await verifyRes.json();
    if (data?.ok && data?.email) {
      locals.session = {
        loggedIn: true,
        email: data.email,
        expires: data.expires,
      };
    } else {
      locals.session = { loggedIn: false, email: null };
    }
  } catch (err) {
    console.error("❌ Middleware Auth Error:", err);
    locals.session = { loggedIn: false, email: null };
  }

  return await next();
};
