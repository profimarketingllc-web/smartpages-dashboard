import de from "./de";
import en from "./en";

const translations: Record<string, any> = { de, en };

export function t(lang: string, key: string, section: string, param?: any): string {
  const safeLang = lang === "en" ? "en" : "de";
  const sectionData = translations[safeLang]?.[section];
  if (!sectionData) return key;

  let value = sectionData[key];
  if (typeof value === "string" && param !== undefined) value = value.replace("{0}", param);
  if (value) return value;

  console.warn(`[i18n] ⚠️ Missing key "${key}" in section "${section}.${safeLang}"`);
  return key;
}

export function useLang(defaultLang = "de"): string {
  if (typeof window !== "undefined") {
    return window.location.pathname.includes("/en/") ? "en" : "de";
  }
  return defaultLang;
}

export default { t, useLang };
