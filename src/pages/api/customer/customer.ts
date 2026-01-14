import type { APIRoute } from "astro";

const CORE_URL = "https://api.smartpages.online/api/customer/profile";

export const GET: APIRoute = async ({ request }) => {
  try {
    const cookie = request.headers.get("cookie") || "";

    const res = await fetch(CORE_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "cookie": cookie,
      },
      credentials: "include",
    });

    const data = await res.json();
    return new Response(JSON.stringify(data, null, 2), {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://desk.smartpages.online",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  } catch (err) {
    console.error("❌ Fehler im /api/customer/customer Proxy:", err);
    return new Response(JSON.stringify({ ok: false, error: "proxy_failed" }), { status: 500 });
  }
};
