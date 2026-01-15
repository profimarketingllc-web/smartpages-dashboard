/**
 * 🌍 i18n.ts – Übersetzungen und Sprach-Utility für SmartPages Dashboard
 * -------------------------------------------------------------
 * ✅ Einheitliche Übersetzungen für System, Customer, Imprint usw.
 * ✅ Exportiert Hilfsfunktionen `t()` und `useLang()`
 * ✅ SSR- und Middleware-kompatibel
 * ✅ Cloudflare-safe (kein Tree-Shaking, kein Scope-Verlust)
 */

const translations: Record<string, any> = {
  system: {
    de: {
      closeButton: "Schließen",
      cancelButton: "Abbrechen",
      saveButton: "Speichern",
      statusActive: "Aktiv",
      statusInactive: "Inaktiv",
      loggedOut: "Abgemeldet",
      loading: "Lade Daten …",
      error: "Ein Fehler ist aufgetreten.",
      success: "Aktion erfolgreich ausgeführt.",
      warning: "Bitte überprüfe deine Eingaben.",
    },
    en: {
      closeButton: "Close",
      cancelButton: "Cancel",
      saveButton: "Save",
      statusActive: "Active",
      statusInactive: "Inactive",
      loggedOut: "Logged out",
      loading: "Loading data…",
      error: "An error occurred.",
      success: "Action completed successfully.",
      warning: "Please check your input.",
    },
  },

  systemMessage: {
    de: {
      neutralGreeting: "Willkommen bei SmartPages 👋",
      personalized: "Willkommen zurück, {0}! 👋",
      businessGreeting: "Schön, dass Ihr Unternehmen wieder da ist, {0}! 👋",
      trialEndingSoon: "Dein Testzeitraum endet in wenigen Tagen.",
      trialEndingTomorrow: "Dein Testzeitraum endet morgen!",
      trialExpired: "Dein Testzeitraum ist abgelaufen. Bitte aktualisiere deinen Plan.",
    },
    en: {
      neutralGreeting: "Welcome to SmartPages 👋",
      personalized: "Welcome back, {0}! 👋",
      businessGreeting: "Welcome back, {0}! 👋",
      trialEndingSoon: "Your trial period will end soon.",
      trialEndingTomorrow: "Your trial period ends tomorrow!",
      trialExpired: "Your trial period has expired. Please update your plan.",
    },
  },

  customer: {
    de: {
      title: "Kundendaten",
      editTitle: "Kundendaten bearbeiten",
      firstName: "Vorname",
      lastName: "Nachname",
      plan: "Tarif",
      activeUntil: "Aktiv bis",
      status: "Status",
      lastLogin: "Letzter Login",
      button: "Profil bearbeiten",
      loggedOut: "Abgemeldet",
    },
    en: {
      title: "Customer Data",
      editTitle: "Edit Customer Data",
      firstName: "First Name",
      lastName: "Last Name",
      plan: "Plan",
      activeUntil: "Active until",
      status: "Status",
      lastLogin: "Last login",
      button: "Edit Profile",
      loggedOut: "Logged out",
    },
  },

  imprint: {
    de: {
     title: "Impressumsdaten",
     editTitle: "Impressum bearbeiten",
     company: "Firma",
     contact: "Ansprechpartner",
     street: "Straße",
     number: "Hausnummer",
     zip: "PLZ",
     city: "Ort",
     phone: "Telefon",
     email: "E-Mail",
     vat: "USt-ID",
     registerCourt: "Registergericht",
     registerNumber: "Registernummer",
     button: "Impressum bearbeiten",
     success: "Impressum erfolgreich gespeichert.",
     error: "Fehler beim Speichern.",
     loadError: "Konnte Impressumsdaten nicht laden.",
   },
   en: {
     title: "Imprint Information",
     editTitle: "Edit Imprint",
     company: "Company",
     contact: "Contact Person",
     street: "Street",
     number: "Number",
     zip: "ZIP",
     city: "City",
     phone: "Phone",
     email: "Email",
     vat: "VAT ID",
     registerCourt: "Register Court",
     registerNumber: "Register Number",
     button: "Edit Imprint",
     success: "Imprint saved successfully.",
     error: "Error saving imprint.",
     loadError: "Could not load imprint data.",
    },
  },
};

/**
 * 🧠 Übersetzungsfunktion `t()`
 */
export function t(lang: string, key: string, section: keyof typeof translations, param?: any): string {
  try {
    const safeLang = lang === "en" ? "en" : "de";
    const sectionData = translations[section];
    if (!sectionData) {
      console.warn(`[i18n] ⚠️ Unbekannter Abschnitt: "${section}"`);
      return key;
    }
    const group = sectionData[safeLang];
    if (!group) {
      console.warn(`[i18n] ⚠️ Fehlende Sprachgruppe: ${safeLang} in "${section}"`);
      return key;
    }
    let value = group[key as keyof typeof group];
    if (typeof value === "function") value = value(param);
    if (typeof value === "string" && param !== undefined) {
      return value.replace("{0}", param);
    }
    if (typeof value === "string") return value;
    console.warn(`[i18n] ⚠️ Fehlender Schlüssel "${key}" in "${section}.${safeLang}"`);
    return key;
  } catch (err) {
    console.error("[i18n] ❌ Fehler in t():", err);
    return key;
  }
}

/**
 * 🌐 useLang() – Sprache server- oder clientseitig erkennen
 */
export function useLang(defaultLang = "de"): string {
  if (typeof window !== "undefined") {
    return window.location.pathname.includes("/en/") ? "en" : "de";
  }
  return defaultLang;
}

/**
 * 🚀 Default-Export verhindert Tree-Shaking in Cloudflare Pages
 */
export default {
  translations,
  t,
  useLang,
};
