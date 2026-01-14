/**
 * ✅ SmartPages Confirm Endpoint v1.2
 * -----------------------------------
 * - Wird vom Core Worker aufgerufen, um Token aus der Staging-KV zu bestätigen.
 * - Liest den Token aus env.STAGING.
 * - Erstellt Session in env.SESSION (TTL 12h).
 * - Löscht den Staging-Eintrag nach Erfolg.
 * - Setzt Session-Cookie und leitet den Nutzer zum Dashboard weiter.
 */

export async function onRequestGet({ request, locals }) {
  const { env } = locals.runtime;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ ok: false, error: "missing_token" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // 🔹 1. Token aus Staging-KV abrufen
  const stagingData = await env.STAGING.get(token, { type: "json" });
  if (!stagingData || !stagingData.email) {
    console.warn("⚠️ Kein gültiger Token in Staging gefunden.");
    return new Response(JSON.stringify({ ok: false, error: "staging_not_found" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // 🔹 2. Token als "verbraucht" markieren
  await env.AUTH_DB.prepare(
    `UPDATE magic_tokens SET used_at = unixepoch() WHERE token = ?`
  ).bind(token).run();

  // 🔹 3. Session erstellen
  const sessionId = crypto.randomUUID();
  const sessionData = {
    email: stagingData.email,
    lang: stagingData.lang || "de",
    created: Date.now(),
  };

  await env.SESSION.put(sessionId, JSON.stringify(sessionData), {
    expirationTtl: 12 * 60 * 60, // 12 Stunden
  });

  // 🔹 4. Staging cleanup
  await env.STAGING.delete(token);

  // 🔹 5. Redirect zum Dashboard
  const dashboardUrl = `${env.APP_BASE_URL || "https://desk.smartpages.online"}/${sessionData.lang}/dashboard`;

  const headers = new Headers({
    "Set-Cookie": `session=${sessionId}; Path=/; Domain=${env.COOKIE_DOMAIN || ".smartpages.online"}; Secure; HttpOnly; SameSite=None; Max-Age=${12 * 60 * 60}`,
    Location: dashboardUrl,
    "Access-Control-Allow-Origin": env.FE_ORIGIN || "https://desk.smartpages.online",
    "Access-Control-Allow-Credentials": "true",
  });

  console.log(`✅ Session erstellt für ${sessionData.email}`);

  return new Response(null, { status: 302, headers });
}
