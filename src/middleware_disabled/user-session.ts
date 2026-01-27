// src/middleware/user-session.ts
import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ request, locals }, next) => {
  const cookie = request.headers.get("cookie");

  // ❗ Kein Cookie = kein User, aber OK
  if (!cookie) {
    locals.user = null;
    return next();
  }

  try {
    const res = await fetch(
      "https://api.smartpages.online/api/session/userinfo",
      {
        headers: { Cookie: cookie },
      }
    );

    if (!res.ok) {
      locals.user = null;
      return next();
    }

    const data = await res.json();
    locals.user = data?.ok ? data.user : null;
  } catch (err) {
    console.error("[middleware:user-session]", err);
    locals.user = null;
  }

  return next();
};
