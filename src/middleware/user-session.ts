import type { MiddlewareHandler } from "astro";

// 🧩 Middleware: Liest User-Daten aus Cloudflare KV ("SESSION")
export const onRequest: MiddlewareHandler = async (context, next) => {
  const { locals, request, env } = context;

  try {
    const cookie = request.headers.get("cookie") || "";
    const tokenMatch = cookie.match(/session=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      locals.user = { hasToken: false, note: "No session cookie" };
      return next();
    }

    // 🧠 Prüfe, ob SESSION-KV vorhanden ist
    if (!env || !env.SESSION) {
      locals.user = { hasToken: false, note: "SESSION KV not available" };
      return next();
    }

    // 🔍 Session aus Cloudflare KV abrufen
    const sessionData = await env.SESSION.get(token, { type: "json" });

    if (!sessionData) {
      locals.user = { hasToken: false, note: "No data for token" };
      return next();
    }

    // ✅ User-Daten setzen
    locals.user = {
      hasToken: true,
      email: sessionData.email,
      lang: sessionData.lang || "de",
      plan: sessionData.plan || "trial",
      created: sessionData.created,
    };
  } catch (err: any) {
    console.error("❌ user-session middleware error:", err);
    locals.user = { hasToken: false, error: err.message };
  }

  return next();
};
