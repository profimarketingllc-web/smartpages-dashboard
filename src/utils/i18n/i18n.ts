import dashboard from "./dashboard";
import billing from "./billing";
import login from "./login";
// später:
// import smartpage from "./smartpage";
// import smartprofile from "./smartprofile";
// import smartdomain from "./smartdomain";
// import smartlinks from "./smartlinks";

const dictionaries: Record<string, any> = {
  dashboard,
  billing,
  login,
  // smartpage,
  // smartprofile,
  // smartdomain,
  // smartlinks,
};

/**
 * 🌍 Übersetzungsfunktion (seitenbasiert)
 *
 * @param lang     "de" | "en"
 * @param page     z.B. "dashboard"
 * @param section  z.B. "customer", "system"
 * @param key      z.B. "title", "button"
 */
export function t(
  lang: string,
  page: keyof typeof dictionaries,
  section: string,
  key: string,
  params?: any
): string {
  try {
    const safeLang = lang === "en" ? "en" : "de";
    const pageDict = dictionaries[page];
    if (!pageDict) return key;

    const sectionData = pageDict[safeLang]?.[section];
    if (!sectionData) return key;

    let value = sectionData[key];
    if (typeof value === "function") value = value(params);
    if (typeof value !== "string") return key;

    // Platzhalter ersetzen
    if (params !== undefined) {
      if (Array.isArray(params)) {
        params.forEach((p, i) => {
          value = value.replace(new RegExp(`\\{${i}\\}`, "g"), p);
        });
      } else {
        value = value.replace("{0}", params);
      }
    }

    return value;
  } catch (err) {
    console.error("[i18n] Fehler in t():", err);
    return key;
  }
}

/**
 * 🧭 useLang() – erkennt Sprache aus URL oder SSR
 */
export function useLang(defaultLang = "de"): string {
  if (typeof window !== "undefined") {
    return window.location.pathname.includes("/en/") ? "en" : "de";
  }
  return defaultLang;
}

export default { t, useLang };
