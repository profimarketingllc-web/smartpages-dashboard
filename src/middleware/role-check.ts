import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async ({ locals, redirect, url }) => {
  const lang = locals.lang || "de";
  const user = locals.user;

  // Wenn kein User vorhanden → Redirect zum Login
  if (!user) {
    return redirect(`/${lang}/login`);
  }

  // Admin-Bereich nur für Admins
  if (url.pathname.startsWith(`/${lang}/admin`) && user.role !== "admin") {
    return redirect(`/${lang}/forbidden`);
  }

  // PRO-Bereich nur für aktive User
  if (url.pathname.startsWith(`/${lang}/pro`) && user.plan === "trial") {
    return redirect(`/${lang}/upgrade`);
  }

  // Alles OK → Anfrage normal weiterleiten
  return;
};
