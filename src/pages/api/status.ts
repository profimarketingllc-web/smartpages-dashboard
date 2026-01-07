import type { APIContext } from "astro";

/**
 * 🔐 /api/status
 * Gibt aktuelle Benutzerdaten aus D1 zurück — oder einen sicheren Fallback.
 */
export async function GET(context: APIContext): Promise<Response> {
  const { locals, env } = context;

  try {
    const session = locals.session;
    const db = env.DB; // Dein D1 Binding

    // 🚧 Kein Auth vorhanden → Fallback
    if (!session?.user_id) {
      return new Response(
        JSON.stringify({
          ok: false,
          fallback: true,
          lang: locals.lang || "de",
          firstName: null,
          lastName: null,
          companyName: null,
          isBusiness: 0,
          plan: "trial",
          trialEnd: null,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Userdaten aus D1 lesen
    const user = await db
      .prepare(
        `SELECT first_name, last_name, company_name, is_business, plan, trial_end 
         FROM users WHERE user_id = ? LIMIT 1`
      )
      .bind(session.user_id)
      .first();

    if (!user) {
      return new Response(
        JSON.stringify({
          ok: false,
          fallback: true,
          lang: locals.lang || "de",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🧠 Antwort zurückgeben
    return new Response(
      JSON.stringify({
        ok: true,
        lang: locals.lang || "de",
        ...user,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[API /status] Fehler:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        fallback: true,
        lang: locals.lang || "de",
        error: "Server error",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
