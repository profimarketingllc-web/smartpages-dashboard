import { sequence } from "astro/middleware";
import { onRequest as lang } from "./middleware/lang";
import { onRequest as auth } from "./middleware/auth";

export const onRequest = sequence(lang, auth);
