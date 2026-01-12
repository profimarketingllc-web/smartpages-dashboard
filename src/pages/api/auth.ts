import type { APIRoute } from "astro";

/**
 * 🔐 SmartPages Auth API v4.7 FINAL
 * Erstellt Session in Cloudflare KV + Cookie
 * Bereitet Kompatibilität mit Core Worker Verify vor
 */

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const { email, password } = await request.json();

    // ✳️ Platzhalter-Login — später durch echten Core-Worker-Login ersetzen
    if (email === "admin@smartpages.online" && password === "1234") {
      const sessionId = crypto.randomUUID();

      const sessionData = {
        email,
        lang: "de",
        plan: "trial",
        createdAt: Date.now(),
      };

      // 🧠 Session in Cloudflare KV speichern (1 Stunde)
      await locals.runtime.env.SESSION.put(sessionId, JSON.stringify(sessionData), {
        expirationTtl: 3600,
      });

      // 🍪 Cookie setzen (Subdomain-kompatibel)
      cookies.set("session", sessionId, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "none",
        domain: ".smartpages.online",
        maxAge: 3600,
      });

      console.log(`[AUTH] Neue Session für ${email}`);

      return new Response(
        JSON.stringify({
          ok: true,
          redirect: "/de/dashboard", // später dynamisch (z. B. Sprache/Plan)
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ❌ Login fehlgeschlagen
    return new Response(JSON.stringify({ ok: false, error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[API /auth] Fehler:", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
