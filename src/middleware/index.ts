import { onRequest as userSession } from "./user-session";
import { onRequest as lang } from "./lang";
import { onRequest as roleCheck } from "./role-check";

export const onRequest = async (context, next) => {
  // 1️⃣ Session vom Core holen
  await userSession(context, async () => {});

  // 2️⃣ Sprache setzen
  await lang(context, async () => {});

  // 3️⃣ Rollenprüfung und Weiterleitung
  await roleCheck(context, async () => {});

  // 4️⃣ Weiter zur Route
  return next();
};
