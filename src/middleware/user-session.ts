import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { locals, request, url } = context;

  try {
    const cookie = request.headers.get("cookie") || "";
    const token = cookie.match(/session=([^;]+)/)?.[1];

    if (!token) {
      locals.user = { hasToken: false };
      return next();
    }

    const baseUrl = new URL(url).origin;
    const res = await fetch(`${baseUrl}/api/customer`, {
      headers: { Cookie: cookie, Accept: "application/json" },
    });

    if (!res.ok) {
      locals.user = { hasToken: false };
      console.warn("⚠️ /api/customer antwortete mit:", res.status);
      return next();
    }

    const data = await res.json();

    locals.user = {
      hasToken: true,
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      plan: data.plan,
      lang: data.lang || "de",
      trialEnd: data.trial_end,
    };
  } catch (err) {
    console.error("❌ Fehler in user-session middleware:", err);
    locals.user = { hasToken: false };
  }

  return next();
};
