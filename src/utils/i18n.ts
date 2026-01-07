/**
 * 🌍 i18n.ts – Zentrale Übersetzungs-Utility für SmartPages Dashboard
 * -------------------------------------------------------------------
 * ✅ Einheitliche Übersetzungen für:
 *   - Systemtexte (Buttons, Status, Fehlermeldungen)
 *   - CustomerCard & EditCustomerModal
 *   - ImprintCard & EditImprintModal
 *   - SystemMessage
 * ✅ Erweiterbar für weitere Module
 * ✅ SSR-fähig (kein window nötig)
 * ✅ Unterstützt Platzhalter ({{name}} etc.)
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
    guestWelcome: "Willkommen im SmartCenter 👋",
    personalized: "Willkommen zurück, {{name}} 👋",
    businessGreeting: "Willkommen im SmartCenter von {{name}} 👋",
    trialEndingSoon: "Deine Testphase endet in wenigen Tagen, {{name}}.",
    trialEndingTomorrow: "Letzter Tag deiner Testphase, {{name}} – sichere jetzt deine Daten!",
    trialExpired: "Deine Testphase ist abgelaufen, {{name}}. Bitte wähle einen Tarif.",
  },
  en: {
    guestWelcome: "Welcome to SmartCenter 👋",
    personalized: "Welcome back, {{name}} 👋",
    businessGreeting: "Welcome back, {{name}} 👋 — great to see your business online!",
    trialEndingSoon: "Your trial will end soon, {{name}}.",
    trialEndingTomorrow: "Last day of your trial, {{name}} — back up your data now!",
    trialExpired: "Your trial has expired, {{name}}. Please choose a plan.",
  },
}

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
 * 🧠 `t(lang, key, section, vars)`
 * Allgemeine Übersetzungsfunktion mit Fallback und Variablenersetzung.
 */
export function t(
  lang: string,
  key: string,
  section: keyof typeof translations,
  vars: Record<string, any> = {}
): string {
  const safeLang = lang === "en" ? "en" : "de";
  const group = translations[section][safeLang];
  if (!group) return key;

  let value = group[key as keyof typeof group];
  if (!value) return key;

  // Falls der Wert eine Funktion ist (Legacy), ausführen
  if (typeof value === "function") {
    return (value as any)(vars.name || "");
  }

  // Platzhalter ersetzen
  let msg = value as string;
  for (const [k, v] of Object.entries(vars)) {
    msg = msg.replace(`{{${k}}}`, v ?? "");
  }

  return msg;
}

/**
 * 🌐 useLang() – Hilfsfunktion für Komponenten
 * Erkennt Sprache client- oder serverseitig.
 */
export function useLang(defaultLang = "de"): string {
  if (typeof window !== "undefined") {
    return window.location.pathname.includes("/en/") ? "en" : "de";
  }
  return defaultLang;
}
