/**
 * 🧩 i18n.ts – Minimalversion mit Fix gegen "translations is not defined"
 */

const translations: Record<string, any> = {
  system: {
    de: { hello: "Hallo Welt" },
    en: { hello: "Hello World" },
  },
};

/**
 * 🧠 Sichere Übersetzungsfunktion `t()`
 */
export function t(
  lang: string,
  key: string,
  section: keyof typeof translations,
  param?: any
): string {
  const safeLang = lang === "en" ? "en" : "de";

  const sectionData = translations[section];
  if (!sectionData) {
    console.warn(`[i18n] ⚠️ Unbekannter Übersetzungsbereich: "${section}"`);
    return key;
  }

  const group = sectionData[safeLang];
  if (!group) {
    console.warn(`[i18n] ⚠️ Fehlende Sprachgruppe: ${safeLang} in "${section}"`);
    return key;
  }

  const value = group[key as keyof typeof group];
  if (typeof value === "function") return value(param);
  if (typeof value === "string") return value;

  console.warn(`[i18n] ⚠️ Fehlender Schlüssel "${key}" in "${section}.${safeLang}"`);
  return key;
}

/**
 * 🌐 useLang() – Sprache erkennen
 */
export function useLang(defaultLang = "de"): string {
  if (typeof window !== "undefined") {
    return window.location.pathname.includes("/en/") ? "en" : "de";
  }
  return defaultLang;
}

// 🚀 Optionaler Default-Export verhindert Tree-Shaking in Cloudflare
export default { translations, t, useLang };
