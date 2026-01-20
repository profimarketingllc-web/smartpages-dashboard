import { onRequest as userSession } from "./user-session";
import { onRequest as lang } from "./lang";

export const onRequest = async (context, next) => {
  // Erst Session holen
  await userSession(context, async () => {});
  // Dann Sprache bestimmen
  await lang(context, async () => {});
  // Weiter zur Route
  return next();
};
