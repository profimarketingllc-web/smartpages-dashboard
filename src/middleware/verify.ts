// ============================================================
// ✅ SmartPages Verify Endpoint (Frontend)
// ------------------------------------------------------------
// Wird aufgerufen, wenn der User auf den Magic Link klickt.
// Prüft Token via Core Worker und setzt Session-Cookie.
// ============================================================

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response("Missing token", { status: 400 });
    }

    // Token gegen Core Worker prüfen
    const verifyRes = await fetch(
      `https://api.smartpages.online/api/auth/verify?token=${encodeURIComponent(token)}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );

    if (!verifyRes.ok) {
      return redirect("/login?error=invalid");
    }

    const data = await verifyRes.json();

    if (data?.ok && data?.email) {
      // Cookie für 12 Stunden setzen
      cookies.set("session", token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 12,
      });

      // Weiterleitung auf Dashboard
      return redirect("/dashboard");
    } else {
      return redirect("/login?error=session");
    }
  } catch (err) {
    console.error("❌ Verify.ts Error:", err);
    return redirect("/login?error=server");
  }
};
