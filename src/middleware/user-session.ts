import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { locals, request, url } = context;

  try {
    // 🔹 Session-Cookie prüfen
    const cookie = request.headers.get("cookie") || "";
    const token = cookie.match(/session=([^;]+)/)?.[1];

    if (!token) {
      locals.user = { hasToken: false };
      return next();
    }

    // 🔹 Lokalen API-Endpunkt (Dashboard-Proxy) aufrufen
    //     → das Dashboard ruft intern https://api.smartpages.online/api/customer auf
    const baseUrl = new URL(url).origin;
    const res = await fetch(`${baseUrl}/api/customer`, {
      headers: { Cookie: cookie, Accept: "application/json" },
    });

    if (!res.ok) {
      locals.user = { hasToken: false };
      console.warn("⚠️ /api/customer antwortete mit:", res.status);
      return next();
    }

    // 🔹 Ergebnis übernehmen
    const data = await res.json();

    locals.user = {
      hasToken: true,
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      companyName: data.company_name,
      isBusiness: data.is_business,
      plan: data.plan,
      trialEnd: data.trial_end,
      lang: data.lang || "de",
    };
  } catch (err) {
    console.error("❌ Fehler in user-session middleware:", err);
    locals.user = { hasToken: false };
  }

  return next();
};
