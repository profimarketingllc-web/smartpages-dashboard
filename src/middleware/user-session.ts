import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  console.log("✅ [user-session] Middleware gestartet");

  try {
    const cookieHeader = context.request.headers.get("cookie") || "";
    console.log("🍪 [user-session] Cookie:", cookieHeader || "(leer)");

    const apiUrl = "https://api.smartpages.online/api/session/userinfo";
    console.log("🌐 [user-session] Hole Daten von:", apiUrl);

    const res = await fetch(apiUrl, {
      headers: { Cookie: cookieHeader },
    });

    if (!res.ok) {
      console.warn("⚠️ [user-session] API antwortete mit Status", res.status);
    }

    const data = await res.json().catch(() => null);
    console.log("📡 [user-session] API Antwort:", data);

    if (data?.ok && data.user) {
      console.log("👤 [user-session] Benutzer erfolgreich geladen:", data.user.email);
      context.locals.user = data.user;
    } else {
      console.warn("🚫 [user-session] Keine gültige Benutzerdaten gefunden");
      // Test-Fallback, damit du siehst, dass es funktioniert
      context.locals.user = {
        first_name: "Testuser",
        email: "test@smartpages.online",
        status: "debug",
      };
    }
  } catch (err) {
    console.error("💥 [user-session] Fehler:", err);
    context.locals.user = {
      first_name: "FehlerUser",
      email: "n/a",
      status: "error",
    };
  }

  return next();
};
