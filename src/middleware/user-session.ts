import type { MiddlewareHandler } from "astro";

/**
 * 🧠 user-session.ts
 * -----------------------------------------
 * Holt Userdaten vom Core-Worker (/api/session/userinfo)
 * und legt sie in context.locals.user ab.
 * Pflicht-Middleware für Zugriff, Sprache & Rollen.
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  try {
    const cookieHeader = context.request.headers.get("cookie") || "";
    const apiUrl = "https://api.smartpages.online/api/session/userinfo";

    const res = await fetch(apiUrl, {
      headers: { Cookie: cookieHeader },
      credentials: "include",
    });

    if (!res.ok) {
      console.warn(`[user-session] Core API Status: ${res.status}`);
      context.locals.user = null;
      return next();
    }

    const data = await res.json().catch(() => null);

    if (data?.ok && data.user) {
      const user = data.user;

      context.locals.user = {
        email: user.email,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        role: user.role || "user", // z. B. user / editor / admin
        plan: user.plan || "trial", // z. B. trial / profile / page / domain
        active_products: Array.isArray(user.active_products)
          ? user.active_products
          : [],
        lang: user.language || "de",
        status: user.status || "inactive",
      };

      console.log(`[user-session] ✅ Session aktiv für ${user.email}`);
    } else {
      console.log("[user-session] ⚠️ Keine gültige Session gefunden");
      context.locals.user = null;
    }
  } catch (err) {
    console.error("[user-session] 💥 Fehler:", err);
    context.locals.user = null;
  }

  return next();
};
