// src/utils/i18n/i18n.ts

import dashboard from "./dashboard";
import billing from "./billing";
import login from "./login";

import smartpage from "./smartpage";
import smartprofile from "./smartprofile";
import smartdomain from "./smartdomain";
import smartlinks from "./smartlinks";

const dictionaries: Record<string, any> = {
  dashboard,
  billing,
  login,
  smartpage,
  smartprofile,
  smartdomain,
  smartlinks,
};

export function t(
  lang: string,
  page: keyof typeof dictionaries,
  section: string,
  key: string,
  params?: any
): string {
  const safeLang = lang === "de" ? "de" : "en";

  try {
    const value = dictionaries?.[page]?.[safeLang]?.[section]?.[key];

    if (typeof value === "function") return value(params);
    if (typeof value === "string") return value;

    return key;
  } catch {
    return key;
  }
}

/**
 * 👉 Sprache bewusst setzen
 * - Default: en
 * - Optional per Prop überschreibbar
 */
export function useLang(explicitLang?: "en" | "de"): "en" | "de" {
  if (explicitLang) return explicitLang;
  return "en";
}
