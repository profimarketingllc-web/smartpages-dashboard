import type { APIRoute } from "astro";

/**
 * 📦 API: /api/customer/privacy
 * -------------------------------------------------------
 * ✅ Holt Datenschutzdaten über Core Worker
 * ✅ Leitet Session-Cookie weiter
 * ✅ Greift auf `legal_info` Tabelle zu
 */

const CORE_URL = "https://api.smartpages.online/api/customer/privacy";

export const GET: APIRoute = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";

    if (!cookieHeader.includes("session=")) {
      return new Response(JSON.stringify({ ok: false, error: "no_session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔗 Anfrage an den Core Worker
    const res = await fetch(CORE_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
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

    const json = await res.json();

    // 🧭 Kein Datensatz vorhanden
    if (!json?.ok || !json.data) {
      return new Response(
        JSON.stringify({
          ok: true,
          data: null,
          message: "no_privacy_found",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const p = json.data;

    // 🧱 Normalisierung für das Frontend
    const normalized = {
      company_name: p.company_name || "—",
      contact_name: p.contact_name || "—",
      street: p.street || "—",
      hs_no: p.hs_no || "—",
      postal_code: p.postal_code || "—",
      city: p.city || "—",
      country: p.country || "Deutschland",
      phone: p.phone || "—",
      email: p.email || "—",
      use_custom_privacy: p.use_custom_privacy || 0,
      custom_privacy_text: p.custom_privacy_text || "",
      updated_at: p.updated_at || "—",
    };

    return new Response(JSON.stringify({ ok: true, data: normalized }, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("❌ Fehler im /api/customer/privacy Proxy:", err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
