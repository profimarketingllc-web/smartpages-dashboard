import { sequence } from "astro/middleware";
import { onRequest as lang } from "./middleware/lang";
import { onRequest as auth } from "./middleware/auth";

// 🧠 Sicheres Setup mit vorgeschaltetem Healthcheck
export const onRequest = async (context, next) => {
  // 💚 Healthcheck zuerst — bevor irgendwas anderes passiert
  if (context.url.pathname === "/health") {
    return new Response("✅ Worker & Middleware aktiv (Astro v5)", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // Dann: eigentliche Middleware-Kette initialisieren
  const chain = sequence(lang, auth, async (context, next) => {
    const response = await next();
    response.headers.set("x-middleware-sequence", "ok");
    return response;
  });

  try {
    return await chain(context, next);
  } catch (err: any) {
    console.error("❌ Middleware-Fehler:", err);
    return new Response(`❌ Middleware-Fehler: ${err?.message || err}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
};
