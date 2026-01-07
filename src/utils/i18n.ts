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
