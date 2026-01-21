import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  console.log("✅ [user-session] Middleware gestartet");

  try {
    const cookieHeader =
      context.request.headers.get("cookie") ||
      context.request.headers.get("Cookie") ||
      "";
    console.log("🍪 [user-session] Cookie:", cookieHeader || "(leer)");

    const apiUrl = "https://api.smartpages.online/api/session/userinfo";
    console.log("🌐 [user-session] Hole Daten von:", apiUrl);

    const res = await fetch(apiUrl, {
      headers: { Cookie: cookieHeader },
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("⚠️ [user-session] API antwortete mit Status", res.status);
    }

    const data = await res.json().catch(() => null);
    console.log("📡 [user-session] API Antwort:", data);

    if (data?.ok && data.user) {
      console.log(
        `👤 [user-session] Benutzer geladen: ${data.user.email} (${data.user.role || "keine Rolle"})`
      );

      context.locals.user = {
        email: data.user.email,
        first_name: data.user.first_name || null,
        plan: data.user.plan || "trial",
        role: data.user.role || "user",
        lang: data.user.lang || "de",
      };
    } else {
      console.warn("🚫 [user-session] Keine gültigen Benutzerdaten gefunden");
      context.locals.user = null;
    }
  } catch (err) {
    console.error("💥 [user-session] Fehler:", err);
    context.locals.user = null;
  }

  return next();
};
