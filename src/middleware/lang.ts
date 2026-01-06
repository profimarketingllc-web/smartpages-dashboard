import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ request, locals, cookies, next }) => {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();
  const ref = request.headers.get("referer")?.toLowerCase() || "";

  // 🌍 1️⃣ Sprache erkennen (URL > Referrer > Cookie > Default)
  let lang: "de" | "en" = "de";

  if (path.includes("/en/")) lang = "en";
  else if (ref.includes("/en/")) lang = "en";
  else {
    const cookieLang = cookies.get("lang")?.value;
    if (cookieLang === "en" || cookieLang === "de") lang = cookieLang;
  }

  // 📦 2️⃣ Sprache global speichern (für SSR + Komponenten)
  locals.lang = lang;

  // 🍪 3️⃣ Sprache im Cookie sichern (30 Tage gültig)
  cookies.set("lang", lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
    sameSite: "lax",
  });

  // 🌐 4️⃣ Sprache im Header mitgeben (z. B. für API oder Logs)
  const response = await next();
  response.headers.set("x-smartpages-lang", lang);

  return response;
};
