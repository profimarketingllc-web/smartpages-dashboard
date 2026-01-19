import type { MiddlewareHandler } from "astro";

/**
 * 🧠 SmartPages User-Session Middleware v6.3
 * ------------------------------------------
 * ✅ Liest Session direkt aus Cloudflare KV (Binding: SESSION)
 * ✅ Kein externer Fetch nötig
 * ✅ Übergibt Userdaten an locals.user
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  const { locals, request, env } = context;

  try {
    // 🔑 Session-Cookie auslesen
    const cookie = request.headers.get("cookie") || "";
    const token = cookie.match(/session=([^;]+)/)?.[1];

    if (!token) {
      locals.user = { hasToken: false };
      return next();
    }

    // ⚙️ Session aus Cloudflare KV lesen
    const sessionData = await env.SESSION.get(token);

    if (!sessionData) {
      console.warn(`⚠️ Keine Session in KV für Token: ${token}`);
      locals.user = { hasToken: false };
      return next();
    }

    const data = JSON.parse(sessionData);

    // 🔹 Userdaten aus KV übernehmen
    locals.user = {
      hasToken: true,
      email: data.email || null,
      lang: data.lang || "de",
      plan: data.plan || "trial",
      created: data.created || null,
    };

  } catch (err) {
    console.error("❌ Fehler in user-session middleware:", err);
    locals.user = { hasToken: false };
  }

  return next();
};
