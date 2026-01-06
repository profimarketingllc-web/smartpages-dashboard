import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ request, locals, redirect, next }) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // 1️⃣ Öffentliche Seiten (Whitelist)
  const publicRoutes = ["/", "/login", "/signin", "/register", "/privacy", "/imprint"];
  if (publicRoutes.some((r) => path.startsWith(r))) {
    return next();
  }

  // 2️⃣ Session Token prüfen (Cookie oder Header)
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") ||
    request.headers.get("x-smartpages-token") ||
    getCookie(request.headers.get("cookie") || "", "smartpages_session");

  if (!token) {
    // Kein Token → redirect zum Login
    return redirect("/login");
  }

  // 3️⃣ Token validieren (Worker/D1/API-Aufruf)
  try {
    const res = await fetch("https://api.smartpages.online/api/session/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      console.warn("[Auth] Invalid token");
      return redirect("/login");
    }

    const user = await res.json();

    // 4️⃣ Benutzer in locals speichern (für spätere Nutzung)
    locals.user = user;

    return next();
  } catch (err) {
    console.error("[Auth] Error verifying session:", err);
    return redirect("/login");
  }
};

// 🔹 Kleine Helper-Funktion für Cookie-Parsing
function getCookie(cookieHeader: string, name: string) {
  const match = cookieHeader.match(new RegExp("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"));
  return match ? match[2] : null;
}
