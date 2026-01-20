import type { APIContext } from "astro";

/**
 * ✅ /api/status (v3.0)
 * Liefert aktuelle Benutzer-Session-Informationen
 * über den SmartCore-Endpunkt /api/session/userinfo
 * --------------------------------------------------
 * Kompatibel mit neuem Middleware-System (locals.user)
 */

export async function GET(context: APIContext): Promise<Response> {
  const cookie = context.request.headers.get("cookie") || "";

  try {
    // 🔄 Anfrage an den Core Worker
    const res = await fetch("https://api.smartpages.online/api/session/userinfo", {
      headers: { Cookie: cookie, Accept: "application/json" },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          fallback: true,
          lang: "de",
          error: `Core responded ${res.status}`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const json = await res.json();
    const user = json?.user || null;

    if (!json.ok || !user) {
      return new Response(
        JSON.stringify({
          ok: false,
          fallback: true,
          lang: "de",
          error: "No user data found",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🧠 Erfolgreiche Session
    return new Response(
      JSON.stringify({
        ok: true,
        fallback: false,
        lang: user.language || "de",
        user,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[API /status] Fehler:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        fallback: true,
        lang: "de",
        error: (err as Error).message || "Server error",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
