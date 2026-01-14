import type { APIRoute } from "astro";

/**
 * 🔐 SmartPages Auth API v5.1 (Production)
 * ----------------------------------------
 * - Sendet Login an Core Worker (/api/auth/start)
 * - Kein lokales Verify mehr – Redirect übernimmt das
 * - Voll CORS- und Domain-kompatibel (desk <-> api)
 */

const CORE_AUTH_URL = "https://api.smartpages.online/api/auth/start"; 
// Hinweis: Worker sendet Magic Link mit https://desk.smartpages.online/api/auth/redirect

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();
    if (!email) {
      return new Response(
        JSON.stringify({ ok: false, error: "missing_email" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders(request) },
        }
      );
    }

    // 1️⃣ Anfrage an Core Worker – Magic Link Versand
    const coreRes = await fetch(CORE_AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await coreRes.json();

    if (!coreRes.ok || !result.ok) {
      console.error("❌ Core Worker Auth Fehler:", result);
      return new Response(JSON.stringify(result), {
        status: coreRes.status || 401,
        headers: { "Content-Type": "application/json", ...corsHeaders(request) },
      });
    }

    // 2️⃣ Antwort an Frontend (z. B. “Magic Link wurde gesendet”)
    return new Response(
      JSON.stringify({
        ok: true,
        message: "Magic Link wurde gesendet",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders(request) },
      }
    );

  } catch (err) {
    console.error("❌ [API /auth/start] Fehler:", err);
    return new Response(
      JSON.stringify({ ok: false, error: "server_error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(request) },
      }
    );
  }
};

// ============================================================
// 🌍 CORS Helper – Live-kompatibel (desk ↔ api)
// ============================================================
function corsHeaders(request: Request) {
  const origin =
    request.headers.get("origin") ||
    "https://desk.smartpages.online";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

// ============================================================
// ⚙️ OPTIONS Preflight
// ============================================================
export const OPTIONS: APIRoute = async ({ request }) =>
  new Response(null, { status: 204, headers: corsHeaders(request) });
