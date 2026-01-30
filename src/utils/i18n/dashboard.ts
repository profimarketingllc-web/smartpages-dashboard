export const dashboardI18n = {
  de: {
    /* ================= PAGE META ================= */
    page: {
      title: "Dashboard",
      description:
        "Verwalte deine SmartPages Produkte, Einstellungen und rechtlichen Angaben an einem zentralen Ort.",
    },

    /* ================= SYSTEM MESSAGE ================= */
    messages: {
      neutralGreeting: "Willkommen zurück",
      personalized: (name: string) => `Willkommen zurück, ${name}`,
      businessGreeting: (company: string) =>
        `Willkommen zurück bei ${company}`,
    },

    /* ================= CARDS ================= */
    cards: {
      customer: {
        title: "Kundendaten",
        edit: "Kundendaten bearbeiten",
        statusAuthenticated: "Authentifiziert",
        statusNotAuthenticated: "Nicht authentifiziert",
        name: "Name",
        company: "Unternehmen",
        plan: "Plan",
        activeUntil: "Aktiv bis",
        lastLogin: "Letzter Login",
      },

      imprint: {
        title: "Impressum",
        edit: "Impressum bearbeiten",
        useCustom: "Eigenes Impressum verwenden",
        company: "Unternehmen / Name",
        contact: "Ansprechpartner",
        address: "Adresse",
        email: "E-Mail",
        registerCourt: "Registergericht",
        registerNumber: "Registernummer",
        customHint:
          "Du verwendest ein eigenes Impressum. SmartPages erzeugt oder verändert keine rechtlichen Inhalte.",
      },

      privacy: {
        title: "Datenschutzerklärung",
        edit: "Datenschutz bearbeiten",
        useCustom: "Eigene Datenschutzerklärung verwenden",
        contact: "Datenschutzkontakt",
        address: "Adresse",
        email: "E-Mail",
        customHint:
          "Du verwendest eine eigene Datenschutzerklärung. SmartPages erzeugt oder verändert keine rechtlichen Inhalte.",
      },
    },
  },

  en: {
    /* ================= PAGE META ================= */
    page: {
      title: "Dashboard",
      description:
        "Manage your SmartPages products, settings and legal information in one central place.",
    },

    /* ================= SYSTEM MESSAGE ================= */
    messages: {
      neutralGreeting: "Welcome back",
      personalized: (name: string) => `Welcome back, ${name}`,
      businessGreeting: (company: string) =>
        `Welcome back to ${company}`,
    },

    /* ================= CARDS ================= */
    cards: {
      customer: {
        title: "Customer information",
        edit: "Edit customer",
        statusAuthenticated: "Authenticated",
        statusNotAuthenticated: "Not authenticated",
        name: "Name",
        company: "Company",
        plan: "Plan",
        activeUntil: "Active until",
        lastLogin: "Last login",
      },

      imprint: {
        title: "Imprint",
        edit: "Edit imprint",
        useCustom: "Use custom imprint",
        company: "Company / Name",
        contact: "Contact person",
        address: "Address",
        email: "Email",
        registerCourt: "Register court",
        registerNumber: "Register number",
        customHint:
          "You are using your own imprint. SmartPages will not generate or modify legal content.",
      },

      privacy: {
        title: "Privacy policy",
        edit: "Edit privacy",
        useCustom: "Use custom privacy policy",
        contact: "Privacy contact",
        address: "Address",
        email: "Email",
        customHint:
          "You are using your own privacy policy. SmartPages will not generate or modify legal content.",
      },
    },
  },
};
