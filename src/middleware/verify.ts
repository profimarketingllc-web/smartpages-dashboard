// ============================================================
// 🌟 SmartPages VERIFY Page – Extended Build v3.7
// ============================================================
// Zweck:
//   ✅ Nimmt den Magic-Link Token entgegen (?token=...)
//   ✅ Prüft Token über Core Worker
//   ✅ Setzt Cookie & speichert Session dauerhaft in KV (SESSION)
//   ✅ Zeigt visuelles Feedback ("Login erfolgreich")
//   ✅ Leitet automatisch weiter auf /dashboard (Customer Worker)
// ============================================================

import type { APIRoute } from "astro";

export const get: APIRoute = async ({ request, cookies, redirect, locals }) => {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response("Missing token", { status: 400 });
    }

    // 1️⃣ Token über Core Worker prüfen
    const verifyRes = await fetch(
      `https://api.smartpages.online/api/auth/verify?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!verifyRes.ok) {
      return new Response("Invalid or expired token", { status: 401 });
    }

    const data = await verifyRes.json();

    // 2️⃣ Session-Cookie setzen (12 h gültig)
    cookies.set("session", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 12 * 60 * 60,
    });

    // 3️⃣ Session dauerhaft in KV speichern (Customer Worker / KV SESSION)
    if (locals.runtime?.env?.SESSION) {
      await locals.runtime.env.SESSION.put(
        `session:${data.email}`,
        JSON.stringify({
          email: data.email,
          products: data.products || [],
          verifiedAt: Date.now(),
        }),
        { expirationTtl: 12 * 60 * 60 }
      );
    }

    // 4️⃣ Sofortiges visuelles Feedback
    const html = `
      <html lang="de">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="refresh" content="2;url=/dashboard" />
          <title>Login erfolgreich – SmartPages</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #fafafa;
              color: #333;
              text-align: center;
              margin-top: 20vh;
            }
            h1 { color: #C53A3A; }
            .spinner {
              margin: 20px auto;
              width: 40px; height: 40px;
              border: 4px solid #ddd;
              border-top-color: #C53A3A;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <h1>Login erfolgreich!</h1>
          <p>Willkommen zurück, ${data.email}</p>
          <div class="spinner"></div>
          <p>Du wirst weitergeleitet …</p>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (err: any) {
    console.error("❌ Verify.ts Error:", err);
    return new Response(`Verify failed: ${err.message}`, { status: 500 });
  }
};
