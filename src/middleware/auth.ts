import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ request, locals, redirect, next }) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // 1️⃣ Öffentliche Seiten (Whitelist)
  const publicRoutes = ["/", "/login", "/signin", "/register", "/privacy", "/imprint", "/paywall"];
  if (publicRoutes.some((r) => path.startsWith(r))) {
    return next();
  }

  // 2️⃣ Token prüfen (Cookie oder Header)
  const token =
    request.headers.get("Authorization")?.replace("Bearer ", "") ||
    request.headers.get("x-smartpages-token") ||
    getCookie(request.headers.get("cookie") || "", "smartpages_session");

  if (!token) {
    console.warn("[Auth] Kein Token gefunden → Weiterleitung");
    return redirect(`/login?redirect=${encodeURIComponent(path)}`);
  }

  // 3️⃣ Token gegen API verifizieren
  try {
    const res = await fetch("https://api.smartpages.online/api/session/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      console.warn("[Auth] Ungültiger Token");
      return redirect(`/login?redirect=${encodeURIComponent(path)}`);
    }

    const user = await res.json();
    locals.user = user; // 🔹 Benutzer global verfügbar machen

    // 4️⃣ Zugriff auf Produkte prüfen
    const ownedProducts = user.products || [];

    if (path.includes("/smartpage") && !ownedProducts.includes("smartpage")) {
      return redirect("/paywall?product=page");
    }

    if (path.includes("/smartprofile") && !ownedProducts.includes("smartprofile")) {
      return redirect("/paywall?product=profile");
    }

    if (path.includes("/smartdomain") && !ownedProducts.includes("smartdomain")) {
      return redirect("/paywall?product=domain");
    }

  } catch (err) {
    console.error("[Auth] Fehler beim Verifizieren des Tokens:", err);
    return redirect(`/login?redirect=${encodeURIComponent(path)}`);
  }

  // 5️⃣ Zugriff erlaubt → nächste Middleware oder Seite
  return next();
};

// 🔹 Cookie-Parser
function getCookie(cookieHeader: string, name: string) {
  const match = cookieHeader.match(new RegExp("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"));
  return match ? match[2] : null;
}
