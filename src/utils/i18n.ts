/**
 * 🌍 i18n.ts – Zentrale Übersetzungs-Utility für SmartPages Dashboard
 * -------------------------------------------------------------------
 * ✅ Einheitliche Übersetzungen für:
 *   - Systemtexte (Buttons, Status, Fehlermeldungen)
 *   - CustomerCard & EditCustomerModal
 *   - ImprintCard & EditImprintModal
 *   - SystemMessage
 * ✅ Erweiterbar für weitere Module (Domains, Pages, Profile etc.)
 * ✅ SSR-fähig (kein window nötig)
 */

export const translations = {
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
      info: "Willkommen im SmartCenter 👋",
      success: "Alles läuft reibungslos – Deine Daten sind aktuell.",
      warning: "Achtung: Einige Informationen werden gerade synchronisiert.",
      error: "Ein Fehler ist aufgetreten. Bitte lade die Seite neu.",
      personalized: (name: string) => `Willkommen zurück, ${name}! 👋`,
    },
    en: {
      info: "Welcome to your SmartCenter 👋",
      success: "Everything is running smoothly – your data is up to date.",
      warning: "Note: Some information is currently syncing.",
      error: "An error occurred. Please reload the page.",
      personalized: (name: string) => `Welcome back, ${name}! 👋`,
    },
  },

  customer: {
    de: {
      title: "Kundendaten",
      editTitle: "Kundendaten bearbeiten",
      name: "Name",
      plan: "Tarif",
      activeUntil: "Aktiv bis",
      status: "Status",
      lastLogin: "Letzter Login",
      button: "Profil bearbeiten",
    },
    en: {
      title: "Customer Data",
      editTitle: "Edit Customer Data",
      name: "Name",
      plan: "Plan",
      activeUntil: "Active until",
      status: "Status",
      lastLogin: "Last login",
      button: "Edit Profile",
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
 * 🧠 `t(lang, key, section)`
 * Hilfsfunktion für Typsicherheit & Fallbacks.
 * Beispiel:
 *   t("de", "closeButton", "system")
 *   t("en", "name", "customer")
 *   t("de", "personalized", "systemMessage", "Max")
 */
export function t(lang: string, key: string, section: keyof typeof translations, param?: string): string {
  const safeLang = lang === "en" ? "en" : "de";
  const group = translations[section][safeLang];

  if (!group) return key;
  const value = group[key as keyof typeof group];

  if (typeof value === "function") return value(param || "");
  return (value as string) || key;
}

/**
 * 🌐 useLang() – Hilfsfunktion für Komponenten
 * Erkennt die Sprache serverseitig oder clientseitig (Fallback).
 */
export function useLang(defaultLang = "de"): string {
  if (typeof window !== "undefined") {
    return window.location.pathname.includes("/en/") ? "en" : "de";
  }
  // SSR / Astro-Middleware Fallback
  return defaultLang;
}
