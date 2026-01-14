/**
 * ✅ SmartPages Confirm Endpoint (final redirect version)
 * -----------------------------------
 * - Prüft Token in STAGING
 * - Erstellt Session in KV
 * - Löscht Staging-Token
 * - Leitet User ins Dashboard (setzt Cookie)
 */

export async function onRequestGet({ request, locals }) {
  const { env } = locals.runtime;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  // 1️⃣ Token aus Staging abrufen
  const stagingData = await env.STAGING.get(token, { type: "json" });
  if (!stagingData || !stagingData.email) {
    return new Response("Token invalid or expired", { status: 401 });
  }

  // 2️⃣ Token als verbraucht markieren (falls DB aktiv)
  if (env.AUTH_DB) {
    await env.AUTH_DB.prepare(
      `UPDATE magic_tokens SET used_at = unixepoch() WHERE token = ?`
    ).bind(token).run();
  }

  // 3️⃣ Session erstellen
  const sessionId = crypto.randomUUID();
  const sessionData = {
    email: stagingData.email,
    lang: stagingData.lang || "de",
    created: Date.now(),
  };

  await env.SESSION.put(sessionId, JSON.stringify(sessionData), {
    expirationTtl: 12 * 60 * 60, // 12 Stunden
  });

  // 4️⃣ Staging cleanup
  await env.STAGING.delete(token);

  // 5️⃣ Redirect vorbereiten
  const lang = sessionData.lang || "de";
  const redirectUrl = `${env.APP_BASE_URL || "https://desk.smartpages.online"}/${lang}/dashboard`;

  const headers = new Headers({
    "Set-Cookie": `session=${sessionId}; Path=/; Domain=${env.COOKIE_DOMAIN || ".smartpages.online"}; Secure; HttpOnly; SameSite=None; Max-Age=${12 * 60 * 60}`,
    "Location": redirectUrl,
    "Access-Control-Allow-Origin": env.FE_ORIGIN || "https://desk.smartpages.online",
    "Access-Control-Allow-Credentials": "true",
  });

  console.log(`✅ Session erstellt für ${sessionData.email}`);

  // 👉 Wichtig: echte Weiterleitung
  return new Response(null, { status: 302, headers });
}
