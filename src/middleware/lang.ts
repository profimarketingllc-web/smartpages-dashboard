// ============================================================
// 🌐 SmartPages LANG Middleware – HubSpot Mode v3.8
// ============================================================
// Zweck:
//   ✅ Erkennt Sprache nur aus URL-Präfix (/de/ oder /en/)
//   ✅ Speichert Entscheidung im Cookie (30 Tage)
//   ✅ Bewahrt Sprache zwischen Seitenwechseln
//   ✅ Entfernt alle Browser-/Referrer-Heuristiken
// ============================================================

import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { url, cookies, locals } = context;
  const pathname = url.pathname.toLowerCase();

  // 1️⃣ Sprache nur aus URL ermitteln
  let lang: "de" | "en" = "de"; // Default = Deutsch

  if (pathname.startsWith("/en/")) {
    lang = "en";
  } else if (pathname.startsWith("/de/")) {
    lang = "de";
  } else {
    // Kein Präfix – Fallback auf Cookie
    const cookieLang = cookies.get("lang")?.value as "de" | "en" | undefined;
    if (cookieLang) {
      lang = cookieLang;
    }
  }

  // 2️⃣ Sprache global setzen (für SSR / Layouts)
  locals.lang = lang;

  // 3️⃣ Cookie nur bei Änderung aktualisieren (30 Tage)
  const currentCookie = cookies.get("lang")?.value;
  if (currentCookie !== lang) {
    cookies.set("lang", lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 Tage
      sameSite: "lax",
    });
  }

  // 4️⃣ Weiterverarbeitung mit gesetzter Sprache
  const response = await next();

  // 5️⃣ Response-Header (Debug / Monitoring)
  response.headers.set("x-smartpages-lang", lang);

  return response;
};
