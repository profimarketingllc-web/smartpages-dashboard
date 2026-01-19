import type { MiddlewareHandler } from "astro/middleware";

/**
 * 🧠 User-Session Middleware (v6.5)
 * --------------------------------------------------
 * ✅ Holt Userdaten aus dem Dashboard-Endpunkt /api/customer
 * ✅ Keine direkte Verbindung zur KV
 * ✅ Befüllt locals.user für Templates & Debug
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  const cookie = context.request.headers.get("cookie") || "";
  const hasSession = cookie.includes("session=");

  // Wenn keine Session vorhanden → weiter (oder Redirect)
  if (!hasSession) {
    return next();
  }

  try {
    // 🔄 Anfrage an den bereits funktionierenden API-Endpunkt
    const baseUrl = context.url.origin;
    const res = await fetch(`${baseUrl}/api/customer/customer`, {
      headers: { "Cookie": cookie, "Accept": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();

      // 🧩 Kundendaten in Locals speichern
      context.locals.user = data?.data || data;
    } else {
      console.warn(`⚠️ API /customer antwortete mit ${res.status}`);
    }
  } catch (err) {
    console.error("❌ Fehler beim Abrufen der Kundendaten:", err);
  }

  return next();
};
