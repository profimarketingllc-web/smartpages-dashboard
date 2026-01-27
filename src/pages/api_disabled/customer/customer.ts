/**
 * 📦 API: /api/customer
 * -------------------------------------------------------
 * ✅ Holt Kundendaten über Core Worker
 * ✅ Nutzt Session-Cookie (SmartPages Auth)
 * ✅ Gibt JSON an das Frontend (CustomerCard) zurück
 */

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    if (!cookie.includes("session=")) {
      return new Response(JSON.stringify({ ok: false, error: "no_session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔗 Anfrage an Core Worker weiterleiten
    const res = await fetch("https://api.smartpages.online/api/customer", {
      headers: {
        "Cookie": cookie,
        "Accept": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      console.warn(`⚠️ Core Worker antwortete mit Status ${res.status}`);
      return new Response(JSON.stringify({ ok: false, error: "core_error" }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("❌ Fehler in /api/customer:", err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message || "unexpected_error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
