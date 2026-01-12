import type { APIRoute } from "astro";

/**
 * 🔐 SmartPages Auth API v5.0 (Production)
 * ----------------------------------------
 * - Sendet Login an Core Worker (/api/auth/start)
 * - Erstellt Session-Cookie über Core Verify
 * - Voll CORS- und Domain-kompatibel (desk <-> api)
 */

const CORE_AUTH_URL = "https://api.smartpages.online/api/auth/start";
const VERIFY_URL = "https://api.smartpages.online/verify?mode=json";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
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

    // 1️⃣ Anfrage an Core Worker – Auth starten (Magic Link Versand oder Session Setup)
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

    // 2️⃣ Wenn Core einen Token oder Session erstellt hat → direkt prüfen
    if (result.token) {
      const verifyRes = await fetch(`${VERIFY_URL}&token=${encodeURIComponent(result.token)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (verifyRes.ok) {
        const data = await verifyRes.json();

        if (data.ok && data.email) {
          const sessionId = result.token;

          // 3️⃣ Session-Cookie setzen (Subdomain-kompatibel)
          cookies.set("session", sessionId, {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: "none",
            domain: ".smartpages.online",
            maxAge: 12 * 60 * 60, // 12 Stunden
          });

          console.log(`[AUTH ✅] Session für ${data.email} erfolgreich erstellt`);

          return new Response(
            JSON.stringify({
              ok: true,
              redirect:
                data.lang === "en" ? "/en/dashboard" : "/de/dashboard",
              email: data.email,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders(request) },
            }
          );
        }
      }

      console.warn("⚠️ Verify fehlgeschlagen:", await verifyRes.text());
    }

    // 4️⃣ Fallback: Magic Link Versandbestätigung
    return new Response(
      JSON.stringify({
        ok: true,
        message: "Magic Link wurde gesendet",
        redirect: null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders(request) },
      }
    );
  } catch (err) {
    console.error("❌ [API /auth] Fehler:", err);
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
