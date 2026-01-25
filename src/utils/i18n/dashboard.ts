// src/utils/i18n/dashboard.ts

const dashboard = {
  /* ===================================================================== */
  de: {
    page: {
      title: "SmartPages Dashboard",
    },

    /* ---------------- SYSTEM & GLOBAL ---------------- */
    system: {
      saveButton: "Speichern",
      cancelButton: "Abbrechen",
      savedMessage: "Erfolgreich gespeichert.",
      saving: "Speichern...",
      loadError: "Fehler beim Laden der Daten.",
      statusActive: "Aktiv",
      loggedOut: "Ausgeloggt",
      error: "Es ist ein Fehler aufgetreten.",
      success: "Erfolgreich gespeichert.",
    },

    /* ---------------- SYSTEM MESSAGES (TOP BAR) ---------------- */
    messages: {
      neutralGreeting: "Willkommen bei SmartPages 👋",
      personalized: (name: string) => `Willkommen zurück, ${name}! 👋`,
      businessGreeting: (company: string) =>
        `Willkommen zurück, ${company}!`,
      trialExpired: "Dein Testzeitraum ist abgelaufen.",
      trialEndingTomorrow: "Dein Testzeitraum endet morgen.",
      trialEndingSoon: "Dein Testzeitraum endet bald.",
    },

    /* ---------------- CUSTOMER CARD ---------------- */
    customer: {
      title: "Kundendaten",
      button: "Kundendaten bearbeiten",
      editTitle: "Kundendaten bearbeiten",
      status: "Status",
      plan: "Plan",
      activeUntil: "Aktiv bis",
      lastLogin: "Letzter Login",
      company_name: "Firma",
      firstName: "Vorname",
      lastName: "Nachname",
      loadError: "Kundendaten konnten nicht geladen werden.",
    },

    /* ---------------- IMPRINT ---------------- */
    imprint: {
      title: "Impressumsdaten",
      button: "Impressum bearbeiten",
      editTitle: "Impressum bearbeiten",
      useOwnImprint: "Ich verwende ein eigenes Impressum",

      company: "Firma",
      contact: "Name",
      street: "Straße",
      hs_no: "Hausnummer",
      zip: "PLZ",
      city: "Ort",
      country: "Land",
      email: "E-Mail",
      phone: "Telefon",
      vat: "USt-ID",
      registerCourt: "Registergericht",
      registerNumber: "Registernummer",

      loadError: "Impressum konnte nicht geladen werden.",
      saveSuccess: "Impressum gespeichert.",
      saveError: "Fehler beim Speichern des Impressums.",
      customEnabled: "Eigenes Impressum aktiviert.",
      customDisabled: "Eigenes Impressum deaktiviert.",
    },

    /* ---------------- PRIVACY ---------------- */
    privacy: {
      title: "Datenschutzerklärung",
      button: "Datenschutz bearbeiten",
      editTitle: "Datenschutz bearbeiten",
      useOwnPrivacy: "Ich verwende eine eigene Datenschutzerklärung",
      customTextLabel: "Eigener Datenschutz-Text",

      privacy_contact: "Datenschutzkontakt",
      email: "E-Mail",
      phone: "Telefon",
      address: "Adresse",
      country: "Land",

      loadError: "Datenschutzdaten konnten nicht geladen werden.",
      saveSuccess: "Datenschutz gespeichert.",
      saveError: "Fehler beim Speichern.",
      customEnabled: "Eigener Datenschutz aktiviert.",
      customDisabled: "Eigener Datenschutz deaktiviert.",
      emptyText: "Bitte gib einen Text ein.",
      unexpectedError: "Unerwarteter Fehler.",
    },
  },

  /* ===================================================================== */
  en: {
    page: {
      title: "SmartPages Dashboard",
    },

    /* ---------------- SYSTEM & GLOBAL ---------------- */
    system: {
      saveButton: "Save",
      cancelButton: "Cancel",
      savedMessage: "Saved successfully.",
      saving: "Saving...",
      loadError: "Error loading data.",
      statusActive: "Active",
      loggedOut: "Logged out",
      error: "An error occurred.",
      success: "Saved successfully.",
    },

    /* ---------------- SYSTEM MESSAGES (TOP BAR) ---------------- */
    messages: {
      neutralGreeting: "Welcome to SmartPages 👋",
      personalized: (name: string) => `Welcome back, ${name}! 👋`,
      businessGreeting: (company: string) =>
        `Welcome back, ${company}!`,
      trialExpired: "Your trial has expired.",
      trialEndingTomorrow: "Your trial ends tomorrow.",
      trialEndingSoon: "Your trial ends soon.",
    },

    /* ---------------- CUSTOMER CARD ---------------- */
    customer: {
      title: "Customer Information",
      button: "Edit customer",
      editTitle: "Edit customer",
      status: "Status",
      plan: "Plan",
      activeUntil: "Active until",
      lastLogin: "Last login",
      company_name: "Company",
      firstName: "First name",
      lastName: "Last name",
      loadError: "Customer data could not be loaded.",
    },

    /* ---------------- IMPRINT ---------------- */
    imprint: {
      title: "Imprint information",
      button: "Edit imprint",
      editTitle: "Edit imprint",
      useOwnImprint: "I use my own imprint",

      company: "Company",
      contact: "Name",
      street: "Street",
      hs_no: "House number",
      zip: "ZIP",
      city: "City",
      country: "Country",
      email: "Email",
      phone: "Phone",
      vat: "VAT ID",
      registerCourt: "Register court",
      registerNumber: "Register number",

      loadError: "Imprint could not be loaded.",
      saveSuccess: "Imprint saved.",
      saveError: "Error saving imprint.",
      customEnabled: "Custom imprint enabled.",
      customDisabled: "Custom imprint disabled.",
    },

    /* ---------------- PRIVACY ---------------- */
    privacy: {
      title: "Privacy policy",
      button: "Edit privacy policy",
      editTitle: "Edit privacy policy",
      useOwnPrivacy: "I use my own privacy policy",
      customTextLabel: "My privacy policy text",

      privacy_contact: "Privacy contact",
      email: "Email",
      phone: "Phone",
      address: "Address",
      country: "Country",

      loadError: "Privacy data could not be loaded.",
      saveSuccess: "Privacy saved.",
      saveError: "Error saving privacy.",
      customEnabled: "Custom privacy enabled.",
      customDisabled: "Custom privacy disabled.",
      unexpectedError: "Unexpected error.",
      emptyText: "Please enter a text.",
    },
  },
};

export default dashboard;
