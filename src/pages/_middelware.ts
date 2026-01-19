import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  console.log("✅ Middleware läuft auf Cloudflare");

  context.locals.debug = {
    message: "Middleware wurde ausgeführt 🎉",
    url: context.url.pathname,
    time: new Date().toISOString(),
  };

  return next();
};


// ⚙️ Diese Middleware prüft Session und lädt Userdaten aus D1
export const onRequest: MiddlewareHandler = async (context, next) => {
  const { locals, request } = context;

  try {
    const token = request.headers.get("Cookie")?.match(/session=([^;]+)/)?.[1];
    if (!token) {
      locals.user = { hasToken: false };
      return next();
    }

    const db = context.env?.DB;
    const session = await db
      .prepare("SELECT user_id FROM sessions WHERE token = ?")
      .bind(token)
      .first();

    if (!session) {
      locals.user = { hasToken: false };
      return next();
    }

    const user = await db
      .prepare(
        "SELECT id, first_name, last_name, company_name, is_business, plan, trial_end, lang FROM users WHERE id = ?"
      )
      .bind(session.user_id)
      .first();

    if (!user) {
      locals.user = { hasToken: false };
      return next();
    }

    // 🔹 Userdaten in locals speichern
    locals.user = {
      lang: user.lang || "de",
      hasToken: true,
      firstName: user.first_name,
      lastName: user.last_name,
      companyName: user.company_name,
      isBusiness: user.is_business === 1,
      plan: user.plan || "trial",
      trialEnd: user.trial_end,
    };

    // 🔹 Begrüßungsnachricht vorbereiten
    locals.systemMessage = {
      key: user.first_name ? "personalized" : "neutralGreeting",
      status: user.plan || "trial",
      lang: user.lang || "de",
    };
  } catch (err) {
    console.error("❌ Fehler in user-session middleware:", err);
    locals.user = { hasToken: false };
  }

  return next();
};
