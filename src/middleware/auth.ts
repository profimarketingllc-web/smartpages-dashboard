import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ request, locals, redirect, next }) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Debug-Logging: prüfe SSR / KV / Request-Zustand
  console.log("[AUTH] Incoming request:", path);

  // Öffentliche Seiten (keine Auth)
  const publicRoutes = ["/", "/login", "/signin", "/register", "/privacy", "/imprint"];
  if (publicRoutes.some((r) => path.startsWith(r))) {
    console.log("[AUTH] Public route, bypassing auth.");
    return next();
  }

  try {
    // Token prüfen (aus Header oder Cookie)
    const token =
      request.headers.get("Authorization")?.replace("Bearer ", "") ||
      request.headers.get("x-smartpages-token") ||
      getCookie(request.headers.get("cookie") || "", "smartpages_session");

    if (!token) {
      console.warn("[AUTH] Kein Token gefunden → redirect /login");
      return redirect("/login");
    }

    // Token validieren
    console.log("[AUTH] Token gefunden:", token.substring(0, 12) + "...");

    const res = await fetch("https://api.smartpages.online/api/session/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      console.error("[AUTH] Fehler bei der Token-Verifikation:", res.status);
      return redirect("/login");
    }

    const user = await res.json();
    console.log("[AUTH] Benutzer erfolgreich validiert:", user?.email || "(kein Email)");

    // Nutzer im locals speichern
    locals.user = user;

    return next();
  } catch (err) {
    console.error("[AUTH] Unerwarteter Fehler:", err);
    return new Response("Internal Error in auth middleware: " + (err as Error).message, {
      status: 500,
    });
  }
};

// Kleine Hilfsfunktion für Cookies
function getCookie(cookieHeader: string, name: string) {
  const match = cookieHeader.match(new RegExp("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"));
  return match ? match[2] : null;
}
