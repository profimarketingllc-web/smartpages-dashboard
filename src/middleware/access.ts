import type { MiddlewareHandler } from "astro";

/**
 * 🧩 SmartPages Access Middleware
 * Version: 1.0 (kompatibel mit SmartCore v9.3)
 * ------------------------------------------------
 * Prüft Benutzerrolle & aktive Produkte.
 * Nutzt Core-Endpunkt /api/roles/check
 * Leitfaden:
 *  - Admin: Vollzugriff
 *  - Editor: Eingeschränkter Zugriff
 *  - User: Nur auf aktive Produkte
 */

export const onRequest: MiddlewareHandler = async (context, next) => {
  console.log("🧠 [access] Middleware gestartet");

  try {
    const cookieHeader = context.request.headers.get("cookie") || "";

    const res = await fetch("https://api.smartpages.online/api/roles/check", {
      headers: { Cookie: cookieHeader },
    });

    const data = await res.json().catch(() => null);
    if (!data?.ok || !data.user) {
      console.warn("🚫 [access] Keine gültige Rolle – redirect zu /forbidden");
      return context.redirect("/forbidden");
    }

    const { role, active_products, plan } = data.user;
    console.log(`👤 [access] User: ${role} | Produkte: ${active_products.join(", ")}`);

    // Rolle in Context speichern
    context.locals.role = role;
    context.locals.products = active_products;
    context.locals.plan = plan;

    // --- Regel 1: Admin darf alles ---
    if (role === "admin") {
      console.log("✅ [access] Admin-Zugriff erlaubt");
      return next();
    }

    // --- Regel 2: Editor darf alles außer Billing / Adminbereiche ---
    if (role === "editor") {
      if (context.url.pathname.startsWith("/admin") || context.url.pathname.startsWith("/billing")) {
        console.warn("🚫 [access] Editor hat keinen Zugriff auf diesen Bereich");
        return context.redirect("/forbidden");
      }
      console.log("✅ [access] Editor-Zugriff erlaubt");
      return next();
    }

    // --- Regel 3: User muss aktives Produkt haben ---
    const path = context.url.pathname;

    if (path.startsWith("/profile") && !active_products.includes("profile"))
      return context.redirect("/paywall?product=profile");

    if (path.startsWith("/page") && !active_products.includes("page"))
      return context.redirect("/paywall?product=page");

    if (path.startsWith("/domain") && !active_products.includes("domain"))
      return context.redirect("/paywall?product=domain");

    if (path.startsWith("/links") && !active_products.includes("links"))
      return context.redirect("/paywall?product=links");

    console.log("✅ [access] Zugriff erlaubt");
    return next();
  } catch (err) {
    console.error("💥 [access] Fehler:", err);
    return context.redirect("/forbidden");
  }
};
