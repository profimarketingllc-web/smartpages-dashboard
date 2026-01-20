// src/middleware/user-session.ts
import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, locals } = context;

  try {
    // Session-Cookie extrahieren
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split(";")
      .map(c => c.trim())
      .find(c => c.startsWith("session_id="));

    if (!sessionCookie) {
      locals.user = null;
      return next();
    }

    const sessionId = sessionCookie.split("=")[1];
    if (!sessionId) {
      locals.user = null;
      return next();
    }

    // User-Daten von deiner API abrufen
    const apiUrl = "https://api.smartpages.online/api/session/userinfo";
    const response = await fetch(apiUrl, {
      headers: {
        "Cookie": `session_id=${sessionId}`,
      },
    });

    if (!response.ok) {
      locals.user = null;
      return next();
    }

    const data = await response.json();
    if (data?.ok && data?.user) {
      locals.user = data.user;
    } else {
      locals.user = null;
    }

  } catch (err) {
    console.error("⚠️ user-session middleware error:", err);
    locals.user = null;
  }

  return next();
};
