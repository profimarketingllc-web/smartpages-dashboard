import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ request, locals, next }) => {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();
  const ref = request.headers.get("referer")?.toLowerCase() || "";

  // 🌍 Sprache aus URL erkennen
  let lang: "de" | "en" = "de";
  if (path.includes("/en/")) lang = "en";

  // 🔁 Falls keine Sprache in URL → Referrer prüfen
  else if (ref.includes("/en/")) lang = "en";

  // 📦 Sprache global speichern
  locals.lang = lang;

  // 🌐 Optional: HTTP-Header setzen (z. B. für API-Calls)
  const response = await next();
  response.headers.set("x-smartpages-lang", lang);

  return response;
};
