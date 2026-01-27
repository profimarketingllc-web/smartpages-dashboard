// src/middleware/user-session.ts
import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const cookieHeader = context.request.headers.get("cookie");

  // Standard: nicht eingeloggt
  context.locals.user = null;

  // Kein Cookie → kein User → einfach weiter
  if (!cookieHeader) {
    return next();
  }

  try {
    const res = await fetch(
      "https://api.smartpages.online/api/session/userinfo",
      {
        headers: {
          cookie: cookieHeader, // 👈 NUR das
        },
      }
    );

    if (!res.ok) {
      return next();
    }

    const data = await res.json();

    if (data?.ok && data.user) {
      context.locals.user = data.user;
    }
  } catch (err) {
    console.error("[user-session] failed:", err);
    context.locals.user = null;
  }

  return next();
};
