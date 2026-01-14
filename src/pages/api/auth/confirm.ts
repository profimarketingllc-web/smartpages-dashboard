/**
 * ✅ SmartPages Confirm Endpoint v1.3 (stabil & idempotent)
 * ---------------------------------------------------------
 * - Wird vom Core Worker über /api/auth/confirm?token=... aufgerufen.
 * - Liest Token aus STAGING (KV) und legt Session (TTL 12h) in SESSION ab.
 * - Löscht Staging-Eintrag nach Erfolg.
 * - Setzt Cookie und leitet weiter zum Dashboard.
 * - 🔒 Tokenlose Aufrufe (z. B. aus Dashboard-Komponenten) werden sicher ignoriert.
 */

export async function onRequestGet({ request, locals }) {
  const { env } = locals.runtime;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  // 🧩 1. Kein Token? -> Vermutlich Dashboard- oder System-Call
  // Verhindert 400-Fehler durch doppelte Confirm-Aufrufe
  if (!token) {
    return new Response(
      JSON.stringify({
        ok: false,
        info: "no_token_provided",
        note: "Confirm call ignored – dashboard/system check",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  }

  try {
    // 🧠 2. Token aus Staging-KV abrufen
    const stagingData = await env.STAGING.get(token, { type: "json" });
    if (!stagingData || !stagingData.email) {
      console.warn("⚠️ Kein gültiger Token in STAGING gefunden.");
      return new Response(
        JSON.stringify({ ok: false, error: "staging_not_found" }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // 🧾 3. Token als „verbraucht“ markieren
    await env.AUTH_DB.prepare(
      `UPDATE magic_tokens SET used_at = unixepoch() WHERE token = ?`
    ).bind(token).run();

    // 🪄 4. Session erstellen
    const sessionId = crypto.randomUUID();
    const sessionData = {
      email: stagingData.email,
      lang: stagingData.lang || "de",
      created: Date.now(),
    };

    await env.SESSION.put(sessionId, JSON.stringify(sessionData), {
      expirationTtl: 12 * 60 * 60, // 12 Stunden
    });

    // 🧹 5. STAGING-Eintrag löschen (Cleanup)
    await env.STAGING.delete(token);

    // 🌐 6. Dashboard-Ziel bestimmen
    const baseUrl = env.APP_BASE_URL || "https://desk.smartpages.online";
    const dashboardUrl = `${baseUrl}/${sessionData.lang}/dashboard`;

    // 🍪 7. Cookie-Header setzen
    const cookieHeader = `session=${sessionId}; Path=/; Domain=${
      env.COOKIE_DOMAIN || ".smartpages.online"
    }; Secure; HttpOnly; SameSite=None; Max-Age=${12 * 60 * 60}`;

    // ✅ 8. Erfolg + Redirect
    const headers = new Headers({
      "Set-Cookie": cookieHeader,
      Location: dashboardUrl,
      "Access-Control-Allow-Origin":
        env.FE_ORIGIN || "https://desk.smartpages.online",
      "Access-Control-Allow-Credentials": "true",
    });

    console.log(`✅ Session erstellt für ${sessionData.email}`);

    return new Response(null, { status: 302, headers });
  } catch (err) {
    console.error("❌ Fehler in /api/auth/confirm:", err);
    return new Response(
      JSON.stringify({ ok: false, error: "internal_error", message: err.message }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
