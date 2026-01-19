import type { MiddlewareHandler } from "astro";

// ✅ Middleware für Auth-Session und Userdaten
export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, locals, env } = context;

  try {
    // 1️⃣ Session aus Cookie holen
    const token = request.headers.get("Cookie")?.match(/session=([^;]+)/)?.[1];
    if (!token) {
      locals.user = { hasToken: false };
      return next();
    }

    // 2️⃣ Session in D1-Datenbank nachschlagen
    const db = env.AUTH_DB;
    const session = await db
      .prepare("SELECT user_id FROM sessions WHERE token = ?")
      .bind(token)
      .first();

    if (!session) {
      locals.user = { hasToken: false };
      return next();
    }

    // 3️⃣ Benutzerinformationen holen
    const user = await db
      .prepare(
        `SELECT id, first_name, last_name, company_name, is_business, plan, trial_end, lang 
         FROM users WHERE id = ?`
      )
      .bind(session.user_id)
      .first();

    if (!user) {
      locals.user = { hasToken: false };
      return next();
    }

    // 4️⃣ Userdaten in locals speichern
    locals.user = {
      hasToken: true,
      id: user.id,
      lang: user.lang || "de",
      firstName: user.first_name,
      lastName: user.last_name,
      companyName: user.company_name,
      isBusiness: user.is_business === 1,
      plan: user.plan || "trial",
      trialEnd: user.trial_end,
    };
  } catch (err) {
    console.error("❌ Middleware-Fehler:", err);
    locals.user = { hasToken: false };
  }

  return next();
};
