// ============================================================
// 🌟 SmartPages CORE Worker – Gold v3.5 (Final Stable Build)
// ============================================================
// Funktionen:
//   ✅ /api/auth/start     → Login-Mail anfordern (asynchroner Versand)
//   ✅ /api/auth/verify    → Tokenprüfung
//   ✅ /verify             → Tokenprüfung + Cookie setzen + Redirect
//   ✅ /ping               → Health-Check
//
// interne Kommunikation:
//   ↔ nutzt MAILER (Service Binding → smartpages-mailer)
// ============================================================

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const { pathname, searchParams } = url;

    // ============================================================
    // 🟡 CORS Preflight
    // ============================================================
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: cors(req.headers.get("origin")),
      });
    }

    // ============================================================
    // 1️⃣ LOGIN START – Magic-Link anfordern
    // ============================================================
    if (pathname === "/api/auth/start" && req.method === "POST") {
      let body;
      try {
        body = await req.json();
      } catch {
        return json({ ok: false, error: "invalid_json" }, 400, req);
      }

      const { email, lang = "de" } = body;
      if (!email)
        return json({ ok: false, error: "missing_email" }, 400, req);

      try {
        // 1️⃣ Token erzeugen & in KV speichern
        const token = await createToken(email, env.TOKEN_SECRET);
        await env.SESSION.put(
          token,
          JSON.stringify({
            email,
            products: ["dashboard"],
            created: Date.now(),
          }),
          { expirationTtl: 12 * 60 * 60 } // 12 Stunden Gültigkeit
        );

        // 2️⃣ Bounce-Check (nicht blockierend)
        ctx.waitUntil(checkBounce(email, env));

        // 3️⃣ Mailversand asynchron
        ctx.waitUntil(sendMagicLink(email, lang, token, env));

        // ✅ Benutzer erhält sofort Rückmeldung
        return json({ ok: true, message: "magic_link_dispatched" }, 200, req);
      } catch (err) {
        console.error("❌ Auth start error:", err);
        return json({ ok: false, error: err.message }, 500, req);
      }
    }

    // ============================================================
    // 2️⃣ AUTH VERIFY – Tokenprüfung (API)
    // ============================================================
    if (pathname === "/api/auth/verify" && req.method === "GET") {
      const token = searchParams.get("token");
      if (!token)
        return json({ ok: false, error: "missing_token" }, 400, req);

      const data = await env.SESSION.get(token, { type: "json" });
      if (!data)
        return json({ ok: false, error: "invalid_or_expired" }, 401, req);

      return json(
        { ok: true, email: data.email, products: data.products },
        200,
        req
      );
    }

    // ============================================================
    // 3️⃣ VERIFY – Cookie setzen + Redirect (User Journey)
    // ============================================================
    if (pathname === "/verify" && req.method === "GET") {
      const token = searchParams.get("token");
      if (!token)
        return new Response("Missing token", { status: 400 });

      const data = await env.SESSION.get(token, { type: "json" });
      if (!data)
        return new Response("Invalid or expired token", { status: 401 });

      const headers = new Headers({
        "Set-Cookie": `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${12 * 60 * 60}`,
        "Location": "/dashboard",
      });

      return new Response(null, { status: 302, headers });
    }

    // ============================================================
    // 4️⃣ HEALTH CHECK
    // ============================================================
    if (pathname === "/ping") {
      return json({ ok: true, service: "core", status: "running" }, 200, req);
    }

    // ============================================================
    // ❌ Fallback – 404
    // ============================================================
    return json({ ok: false, error: "not_found" }, 404, req);
  },
};

// ============================================================
// 🔧 Helper-Funktionen
// ============================================================

// Bounce-Prüfung (intern via MAILER)
async function checkBounce(email, env) {
  try {
    const res = await env.MAILER.fetch(
      new Request(
        new URL(
          `/api/bounces/check?email=${encodeURIComponent(email)}`,
          "https://mailer"
        )
      )
    );
    const data = await res.json();
    if (data?.bounced) console.warn(`🚫 Bounce detected for ${email}`);
  } catch (e) {
    console.warn("⚠️ Bounce check skipped:", e.message);
  }
}

// Magic-Link Versand über Mailer-Worker
async function sendMagicLink(email, lang, token, env) {
  try {
    const sendReq = new Request(new URL("/api/send", "https://mailer"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "magic_link",
        email,
        lang,
        data: {
          verifyUrl: `${env.APP_BASE_URL}/verify?token=${token}`,
          validMinutes: 15,
        },
      }),
    });

    const res = await env.MAILER.fetch(sendReq, {
      cf: { cacheTtl: 0, cacheEverything: false },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("❌ Mail send error:", err);
    }
  } catch (err) {
    console.error("❌ Mail dispatch failed:", err);
  }
}

// CORS Helper
function cors(origin) {
  const allow = origin || "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  };
}

// JSON Helper
function json(obj, status = 200, req) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...cors(req?.headers?.get("origin")),
    },
  });
}

// ============================================================
// 🔐 Token Generator (WebCrypto HMAC-SHA256, Cloudflare-kompatibel)
// ============================================================

async function createToken(email, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const timestamp = Date.now().toString();
  const data = `${email}:${timestamp}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const hash = [...new Uint8Array(signature)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${hash}.${btoa(email)}`;
}
