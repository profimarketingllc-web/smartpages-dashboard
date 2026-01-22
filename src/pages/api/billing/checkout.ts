import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { price_id, success_url, cancel_url } = body;

    if (!price_id || !success_url || !cancel_url) {
      return new Response(JSON.stringify({ ok: false, error: "missing_params" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ⚙️ Deinen Cloudflare Test-Worker aufrufen:
    const workerUrl = "https://smart-billing-test.profi-marketing-llc.workers.dev/api/checkout";

    const res = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price_id, success_url, cancel_url }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/billing/checkout] Fehler:", err);
    return new Response(JSON.stringify({ ok: false, error: "internal_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
