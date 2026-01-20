// src/middleware/user-session.ts
import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  try {
    const apiUrl = "https://api.smartpages.online/api/session/userinfo";

    // Optional: Cookie weiterreichen (z. B. für eingeloggte Sitzungen)
    const res = await fetch(apiUrl, {
      headers: {
        Cookie: context.request.headers.get("cookie") || "",
      },
    });

    const data = await res.json();

    // Falls User-Objekt vorhanden, speichern
    if (data?.ok && data.user) {
      context.locals.user = data.user;
    } else {
      context.locals.user = null;
    }
  } catch (err) {
    console.error("Fehler in user-session middleware:", err);
    context.locals.user = null;
  }

  return next();
};
