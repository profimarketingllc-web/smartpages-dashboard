import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ request, locals, redirect, next, platform }) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // 1️⃣ Öffentliche Routen (nicht geschützt)
  const publicRoutes = ["/", "/login", "/signin", "/register", "/privacy", "/imprint"];
  if (publicRoutes.some((r) => path.startsWith(r))) {
    return next();
  }

  // 2️⃣ Token aus Cookie oder Header lesen
  const cookieHeader = request.headers.get("cookie") || "";
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") ||
    getCookie(cookieHeader, "smartpages_session");

  if (!token) {
    console.warn("[Auth] Kein Token gefunden, redirect → /login");
    return redirect("/login");
  }

  try {
    // 3️⃣ Cloudflare KV-Zugriff auf Session
    const sessionData = await platform?.env?.SESSIONS?.get(token, { type: "json" });

    if (!sessionData) {
      console.warn(`[Auth] Ungültige Session für Token: ${token}`);
      return redirect("/login");
    }

    // 4️⃣ User in locals speichern
    locals.user = sessionData.user || null;
    locals.session = sessionData;

    // Optional: Debug-Ausgabe
    console.log("[Auth] User authenticated:", locals.user?.email);

    return next();
  } catch (err) {
    console.error("[Auth] KV-Fehler:", err);
    return redirect("/login");
  }
};

// 🔹 Cookie Helper
function getCookie(cookieHeader: string, name: string) {
  const match = cookieHeader.match(new RegExp("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"));
  return match ? match[2] : null;
}
