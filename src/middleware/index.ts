import { onRequest as userSession } from "./user-session";
import { onRequest as lang } from "./lang";
import { onRequest as access } from "./access";

/**
 * 🌐 SmartPages Middleware Entry
 * --------------------------------------------
 * Reihenfolge ist entscheidend:
 *  1️⃣ Session holen (vom Core)
 *  2️⃣ Sprache setzen
 *  3️⃣ Zugriff & Produkte prüfen
 *  4️⃣ Weiter zur Route
 */
export const onRequest = async (context, next) => {
  // 1️⃣ Session vom Core laden
  await userSession(context, async () => {});

  // 2️⃣ Sprache aus Session oder Browser setzen
  await lang(context, async () => {});

  // 3️⃣ Zugriff & Produkte prüfen
  await access(context, async () => {});

  // 4️⃣ Weiter zur Seite / Route
  return next();
};
