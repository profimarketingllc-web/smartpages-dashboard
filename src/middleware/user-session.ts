import type { MiddlewareHandler } from "astro";

/**
 * 🧠 user-session.ts (SmartPages v7.3)
 * -----------------------------------------
 * Holt Userdaten vom Core-Worker (/api/session/userinfo)
 * und legt sie in context.locals.user ab.
 * Pflicht-Middleware für Zugriff, Sprache & Rollen.
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  try {
    const cookieHeader = context.request.headers.get("cookie") || "";
    const apiUrl = "https://api.smartpages.online/api/session/userinfo";

    if (!cookieHeader.includes("session=")) {
      console.warn("[user-session] 🚫 Keine Session im Cookie gefunden");
      context.locals.user = null;
      return next();
    }

    const res = await fetch(apiUrl, {
      headers: { Cookie: cookieHeader },
      credentials: "include",
    });

    if (!res.ok) {
      console.warn(`[user-session] ⚠️ Core API antwortete mit Status ${res.status}`);
      context.locals.user = null;
      return next();
    }

    const data = await res.json().catch(() => null);

    if (data?.ok && data.user) {
      const u = data.user;

      // 🔹 ALLE relevanten Felder übertragen, damit SystemMessage funktioniert
      context.locals.user = {
        email: u.email || "",
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        company_name: u.company_name || "",
        is_business: u.is_business || 0,
        plan: u.plan || "trial",
        status: u.status || "inactive",
        language: u.language || "de",
        trial_end: u.trial_end || null,
        last_login: u.last_login || null,
        role: u.role || "user",
        active_products: Array.isArray(u.active_products)
          ? u.active_products
          : [],
      };

      console.log(
        `[user-session] ✅ Session aktiv für ${u.email} (${u.plan}, ${u.status})`
      );
    } else {
      console.warn("[user-session] ⚠️ Keine gültige Sessiondaten gefunden");
      context.locals.user = null;
    }
  } catch (err) {
    console.error("[user-session] 💥 Fehler in Middleware:", err);
    context.locals.user = null;
  }

  return next();
};
