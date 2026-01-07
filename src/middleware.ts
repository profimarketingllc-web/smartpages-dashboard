import { sequence } from "astro/middleware";
import { onRequest as lang } from "./middleware/lang";
import { onRequest as auth } from "./middleware/auth";

// ✅ 1️⃣ Health-Check separat behandeln (läuft immer, egal was schiefgeht)
export const onRequest: MiddlewareHandler = async (context, next) => {
  if (context.url.pathname === "/health") {
    return new Response("✅ Worker & Middleware aktiv (Astro v5)", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // ✅ 2️⃣ Middleware-Kette zusammenbauen
  const chain = sequence(lang, auth);

  try {
    // Wichtig: chain() statt sequence(lang, auth, ...) direkt!
    const response = await chain(context, next);
    response.headers.set("x-middleware-sequence", "ok");
    return response;
  } catch (err: any) {
    console.error("❌ Middleware-Fehler:", err);
    return new Response(`❌ Middleware-Fehler: ${err?.message || "Unbekannt"}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
};
