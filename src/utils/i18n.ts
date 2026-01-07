/**
 * 🌍 i18n.ts – Übersetzungen und Sprach-Utility für SmartPages Dashboard
 * -------------------------------------------------------------
 * ✅ Einheitliche Übersetzungen für System, Customer, Imprint usw.
 * ✅ Exportiert Hilfsfunktionen `t()` und `useLang()`
 * ✅ SSR- und Middleware-kompatibel
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
 * Beispiel: t("de", "saveButton", "system")
 */
export function t(
  lang: string,
  key: string,
  section: keyof typeof translations,
  param?: any
): string {
  const safeLang = lang === "en" ? "en" : "de";
  const group = translations[section][safeLang];
  if (!group) return key;
  const value = group[key as keyof typeof group];
  if (typeof value === "function") return value(param);
  return (value as string) || key;
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
