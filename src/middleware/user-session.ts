import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  try {
    const cookieHeader = context.request.headers.get("cookie") || "";
    const apiUrl = "https://api.smartpages.online/api/session/userinfo";

    const res = await fetch(apiUrl, {
      headers: { Cookie: cookieHeader },
    });

    const data = await res.json().catch(() => null);

    if (data?.ok && data.user) {
      const user = data.user;

      // 💾 Lokale Speicherung der Userdaten
      context.locals.user = {
        email: user.email,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        role: user.role || "user",
        plan: user.plan || "trial",
        active_products: Array.isArray(user.active_products)
          ? user.active_products
          : [],
        lang: user.language || "de",
        status: user.status || "inactive",
      };

      // 🔐 (Später aktivierbar)
      // if (context.locals.user.role !== "admin") {
      //   return context.redirect("/forbidden");
      // }
    } else {
      context.locals.user = null;
    }
  } catch (err) {
    console.error("[use.session] Fehler:", err);
    context.locals.user = null;
  }

  return next();
};
