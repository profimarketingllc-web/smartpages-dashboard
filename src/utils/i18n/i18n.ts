// src/utils/i18n/i18n.ts

import dashboard from "./dashboard";
import billing from "./billing";
import login from "./login";

import smartpage from "./smartpage";
import smartprofile from "./smartprofile";
import smartdomain from "./smartdomain";
import smartlinks from "./smartlinks";

/**
 * 📚 Zentrale Dictionaries
 */
const dictionaries: Record<string, any> = {
  dashboard,
  billing,
  login,
  smartpage,
  smartprofile,
  smartdomain,
  smartlinks,
};

/**
 * 🌍 Übersetzungsfunktion (BORING & STABIL)
 *
 * @param lang    "en" | "de"
 * @param page    z.B. "login", "dashboard"
 * @param section z.B. "header", "form"
 * @param key     z.B. "title", "button"
 */
export function t(
  lang: string,
  page: keyof typeof dictionaries,
  section: string,
  key: string,
  params?: string | string[]
): string {
  const safeLang = lang === "de" ? "de" : "en"; // ✅ GLOBAL FALLBACK = EN
  const pageDict = dictionaries[page];

  if (!pageDict) return key;

  let value = pageDict?.[safeLang]?.[section]?.[key];

  if (typeof value === "function") {
    value = value(params);
  }

  if (typeof value !== "string") {
    return key;
  }

  // 🔁 Platzhalter {0}, {1}, …
  if (params) {
    const list = Array.isArray(params) ? params : [params];
    list.forEach((p, i) => {
      value = value.replace(new RegExp(`\\{${i}\\}`, "g"), p);
    });
  }

  return value;
}

/**
 * 🌐 Client Helper
 * Einheitliche Quelle für alle Komponenten
 */
export function getLang(): string {
  if (typeof window !== "undefined" && window.SMARTPAGES_LANG) {
    return window.SMARTPAGES_LANG;
  }
  return "en"; // 🔒 HARTE FALLBACK-SPRACHE
}
