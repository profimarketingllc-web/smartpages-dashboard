// src/utils/i18n/i18n.ts

import dashboard from "./dashboard";
import billing from "./billing";
import login from "./login";

import smartpage from "./smartpage";
import smartprofile from "./smartprofile";
import smartdomain from "./smartdomain";
import smartlinks from "./smartlinks";

const dictionaries = {
  dashboard,
  billing,
  login,
  smartpage,
  smartprofile,
  smartdomain,
  smartlinks,
  sidebar,
};

/**
 * 🌍 Zentrale Übersetzungsfunktion
 */
export function t(
  lang: string,
  page: keyof typeof dictionaries,
  section: string,
  key: string,
  params?: any
): string {
  const safeLang = lang === "de" ? "de" : "en";
  const pageDict = dictionaries[page];

  if (!pageDict) return key;
  const sectionData = pageDict[safeLang]?.[section];
  if (!sectionData) return key;

  let value = sectionData[key];
  if (typeof value === "function") value = value(params);
  if (typeof value !== "string") return key;

  return value;
}

/**
 * 🧭 EINZIGE Sprachlogik
 * - kein Slug
 * - kein Pfad
 * - optional später Cookie / User-Setting
 */
export function resolveLang(): "en" | "de" {
  if (typeof window !== "undefined") {
    return navigator.language.startsWith("de") ? "de" : "en";
  }
  return "en";
}
