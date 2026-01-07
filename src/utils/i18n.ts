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
      personalized: (name: string) => `Willkommen zurück, ${name || "Benutzer"}! 👋`,
      businessGreeting: (company: string) => `Willkommen im SmartCenter von ${company}! 🏢`,
      trialEndingSoon: "Dein Testzeitraum läuft in den nächsten 3 Tagen ab.",
      trialEndingTomorrow: "Dein Testzeitraum endet morgen!",
      trialExpired: "Dein Testzeitraum ist abgelaufen. Bitte verlängere deinen Zugang.",
    },
    en: {
      personalized: (name: string) => `Welcome back, ${name || "User"}! 👋`,
      businessGreeting: (company: string) => `Welcome to ${company}'s SmartCenter! 🏢`,
      trialEndingSoon: "Your trial period will end in the next 3 days.",
      trialEndingTomorrow: "Your trial period ends tomorrow!",
      trialExpired: "Your trial period has expired. Please renew your access.",
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
      button: "Impressum bearbeiten",
      success: "Impressum erfolgreich gespeichert.",
      error: "Fehler beim Speichern.",
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
      button: "Edit Imprint",
      success: "Imprint saved successfully.",
      error: "Error saving imprint.",
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
    const value = group[key as keyof typeof group];
    if (typeof value === "function") return value(param);
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
