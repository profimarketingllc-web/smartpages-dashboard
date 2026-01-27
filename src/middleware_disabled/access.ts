// ------------------------------------------------------------
// 9️⃣ BILLING PROXY (Test / Live Umschaltung)
// ------------------------------------------------------------
if (pathname.startsWith("/api/billing/")) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/session=([^;]+)/);
  const sessionId = match ? match[1] : null;
  if (!sessionId) return json({ ok: false, error: "unauthorized" }, 401);

  const session = await env.SESSION.get(sessionId, { type: "json" });
  if (!session?.email) return json({ ok: false, error: "invalid_session" }, 401);

  // 🧭 Steuerung: Test oder Live Billing-Worker?
  const BILLING_URL =
    env.MODE === "test"
      ? "https://smart-billing-test.profi-marketing-llc.workers.dev"
      : "https://smart-billing.profi-marketing-llc.workers.dev";

  const targetPath = pathname.replace("/api/billing", "");
  const internalUrl = `${BILLING_URL}${targetPath}`;
  console.log(`[SmartCore] 💳 Proxy → ${internalUrl}`);

  const internalReq = new Request(internalUrl, {
    method: req.method,
    headers: {
      "x-session-email": session.email,
      "x-session-lang": session.lang || "de",
      "x-session-plan": session.plan || "trial",
      "Content-Type": "application/json",
    },
    body: req.method !== "GET" ? await req.text() : undefined,
  });

  const proxied = await fetch(internalReq);
  const responseText = await proxied.text();

  return new Response(responseText, {
    status: proxied.status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}
