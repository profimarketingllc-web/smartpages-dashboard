import type { APIRoute } from "astro";

const CORE_URL = "https://api.smartpages.online/api/customer/imprint/update";

export const POST: APIRoute = async ({ request }) => {
  try {
    const cookie = request.headers.get("cookie") || "";
    const body = await request.text();

    const res = await fetch(CORE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "cookie": cookie,
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
      },
    });
  } catch (err) {
    console.error("❌ Fehler im /api/customer/imprintedit Proxy:", err);
    return new Response(JSON.stringify({ ok: false, error: "proxy_failed" }), { status: 500 });
  }
};
