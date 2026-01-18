import { i18n_de } from "./de";
import { i18n_en } from "./en";

const dictionaries = {
  de: i18n_de,
  en: i18n_en,
};

/**
 * 🌍 Übersetzungsfunktion t()
 * t(lang, key, section, param?)
 */
export function t(lang: string, key: string, section: string, param?: any): string {
  try {
    const safeLang = lang === "en" ? "en" : "de";
    const dict = dictionaries[safeLang];
    const sectionData = dict?.[section];
    if (!sectionData) return key;

    let value = sectionData[key];
    if (typeof value === "function") value = value(param);
    if (typeof value === "string" && param !== undefined) {
      return value.replace("{0}", param);
    }
    return value || key;
  } catch (err) {
    console.error("[i18n] Fehler in t():", err);
    return key;
  }
}

/**
 * 🧭 useLang() – erkennt Sprache aus URL
 */
export function useLang(defaultLang = "de"): string {
  if (typeof window !== "undefined") {
    return window.location.pathname.includes("/en/") ? "en" : "de";
  }
  return defaultLang;
}

export default { t, useLang };
