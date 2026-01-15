import type { APIRoute } from "astro";

/**
 * 📦 API: /api/customer/imprint
 * -------------------------------------------------------
 * ✅ Holt Impressumsdaten über Core Worker
 * ✅ Leitet Session-Cookie weiter
 * ✅ Normalisiert D1-Felder für Dashboard-Kompatibilität
 */

const CORE_URL = "https://api.smartpages.online/api/imprint";

export const GET: APIRoute = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";

    if (!cookieHeader.includes("session=")) {
      return new Response(JSON.stringify({ ok: false, error: "no_session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔗 Anfrage an den Core Worker weiterleiten
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

    // 🧭 Wenn kein Datensatz vorhanden → leeres Objekt zurückgeben
    if (!json?.ok || !json.data) {
      return new Response(
        JSON.stringify({
          ok: true,
          data: null,
          message: "no_imprint_found",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const i = json.data;

    // 🧱 Normalisierung auf erwartete Dashboard-Struktur
    const normalized = {
      company_name: i.company_name || "—",
      contact_name: i.contact_name || "—",
      street: i.street || "—",
      hs_no: i.hs_no || "—",
      postal_code: i.postal_code || "—",
      city: i.city || "—",
      country: i.country || "Deutschland",
      phone: i.phone || "—",
      email: i.email || "—",
      vat_id: i.tax_id || "—",
      register_court: i.register_court || "—",
      register_number: i.register_number || "—",
      updated_at: i.updated_at || "—",
    };

    return new Response(JSON.stringify({ ok: true, data: normalized }, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("❌ Fehler im /api/customer/imprint Proxy:", err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
