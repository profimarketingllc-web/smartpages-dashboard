import type { APIRoute } from "astro";

/**
 * 📦 API: /api/customer/privacyedit
 * -------------------------------------------------------
 * ✅ Leitet Datenschutz-Update an Core Worker weiter
 * ✅ Nutzt Session-Cookie (.smartpages.online)
 * ✅ Gibt Worker-Antwort ans Frontend zurück
 */

const CORE_URL = "https://api.smartpages.online/api/customer/privacyedit";

export const POST: APIRoute = async ({ request }) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const body = await request.text();

    const res = await fetch(CORE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body,
      credentials: "include",
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://desk.smartpages.online",
        "Access-Control-Allow-Credentials": "true",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("❌ Fehler im /api/customer/privacyedit Proxy:", err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message || "proxy_failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
