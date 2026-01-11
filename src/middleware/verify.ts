// ============================================================
// 🌟 SmartPages VERIFY Page – v4.6 (Core 4.6 kompatibel)
// ============================================================
// Zweck:
//   ✅ Liest Token aus ?token=...
//   ✅ Prüft Token über Core Worker (/verify)
//   ✅ Setzt Cookie domainweit
//   ✅ Zeigt Feedback ("Login erfolgreich")
//   ✅ Leitet automatisch zum Dashboard
// ============================================================

import type { APIRoute } from "astro";

export const get: APIRoute = async ({ request, cookies, redirect, locals }) => {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (!token) return new Response("Missing token", { status: 400 });

    // 1️⃣ Token über Core Worker prüfen
    const verifyRes = await fetch(
      `https://api.smartpages.online/verify?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!verifyRes.ok) {
      return new Response("Invalid or expired token", { status: 401 });
    }

    const data = await verifyRes.json();

    // 2️⃣ Cookie setzen (12h gültig)
    cookies.set("session", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".smartpages.online",
      maxAge: 12 * 60 * 60,
    });

    // 3️⃣ SESSION KV (optional für SSR)
    if (locals.runtime?.env?.SESSION) {
      await locals.runtime.env.SESSION.put(
        `session:${data.email}`,
        JSON.stringify({
          email: data.email,
          lang: data.lang,
          products: data.products || [],
          verifiedAt: Date.now(),
        }),
        { expirationTtl: 12 * 60 * 60 }
      );
    }

    // 4️⃣ Visuelles Feedback (2s Redirect)
    const dashboard =
      data.lang === "en"
        ? "https://desk.smartpages.online/en/dashboard"
        : "https://desk.smartpages.online/de/dashboard";

    const html = `
      <!DOCTYPE html>
      <html lang="${data.lang || "de"}">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="refresh" content="2;url=${dashboard}" />
          <title>Login erfolgreich – SmartPages</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f9fafb;
              color: #333;
              text-align: center;
              margin-top: 15vh;
            }
            h1 { color: #2b6cb0; }
            .spinner {
              margin: 20px auto;
              width: 40px;
              height: 40px;
              border: 4px solid #ddd;
              border-top-color: #2b6cb0;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <h1>Login erfolgreich 🎉</h1>
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
    console.error("❌ VERIFY Error:", err);
    return new Response(`Verify failed: ${err.message}`, { status: 500 });
  }
};
