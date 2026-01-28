// src/utils/i18n/login.ts
// ======================================================
// Login i18n – FINAL
// ✔ JSON-only (Core Worker compatible)
// ✔ Single source for DE + EN
// ✔ No success/error state (handled by popup)
// ✔ Includes page title, hero, form, privacy, products
// ======================================================

const login = {
  /* ================================================== */
  /* 🇩🇪 DEUTSCH                                        */
  /* ================================================== */
  de: {
    /* ---------------- PAGE META ---------------- */
    page: {
      title: "Login – SmartPages",
    },

    /* ---------------- HERO --------------------- */
    hero: {
      title: "Willkommen bei SmartPages",
      text:
        "Melde Dich an, um Deine Profile, Domains und Abonnements zu verwalten.",
    },

    /* ---------------- FORM --------------------- */
    form: {
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail-Adresse",
      business: "Geschäftskonto",
      button: "Magic Link senden",
    },

    /* ---------------- PRIVACY ------------------ */
    privacy: {
      title: "Datenschutz & Sicherheit",
      text:
        "Wir verwenden Deine Daten ausschließlich zum Versand des Magic Links. " +
        "Der Link ist zeitlich begrenzt gültig und verfällt automatisch. " +
        "Es erfolgt keine Speicherung und keine Weitergabe an Dritte.",
    },

    /* ---------------- PRODUCTS ----------------- */
    products: {
      smartprofile: {
        title: "SmartProfile",
        label: "Bald verfügbar",
        text:
          "Dein persönliches Online-Profil – sicher in Europa gehostet, " +
          "sichtbar, vertrauenswürdig und vollständig DSGVO-konform.",
      },
      smartpage: {
        title: "SmartPage",
        label: "Bald verfügbar",
        text:
          "Erstelle konversionsstarke Seiten in wenigen Minuten – " +
          "ganz ohne Programmierung.",
      },
      smartdomain: {
        title: "SmartDomain",
        label: "Bald verfügbar",
        text:
          "Eigene Domain, SSL & Datenschutz – alles aus einer Hand, " +
          "DSGVO-konform und in Europa gehostet.",
      },
      smartlinks: {
        title: "SmartLinks",
        label: "In Vorbereitung",
        text:
          "Datenschutzfreundliche Kurzlinks mit Analyse-Fokus – " +
          "ideal für Social Media und Kampagnen.",
      },
    },
  },

  /* ================================================== */
  /* 🇬🇧 ENGLISH                                        */
  /* ================================================== */
  en: {
    /* ---------------- PAGE META ---------------- */
    page: {
      title: "Login – SmartPages",
    },

    /* ---------------- HERO --------------------- */
    hero: {
      title: "Welcome to SmartPages",
      text:
        "Sign in to manage your profiles, domains and subscriptions.",
    },

    /* ---------------- FORM --------------------- */
    form: {
      firstName: "First name",
      lastName: "Last name",
      email: "Email address",
      business: "Business account",
      button: "Send Magic Link",
    },

    /* ---------------- PRIVACY ------------------ */
    privacy: {
      title: "Privacy & Security",
      text:
        "We only use your data to send the magic link. " +
        "The link expires automatically after a short time. " +
        "No data is stored or shared with third parties.",
    },

    /* ---------------- PRODUCTS ----------------- */
    products: {
      smartprofile: {
        title: "SmartProfile",
        label: "Coming soon",
        text:
          "Your personal online profile – securely hosted in Europe, " +
          "optimized for trust, visibility and full GDPR compliance.",
      },
      smartpage: {
        title: "SmartPage",
        label: "Coming soon",
        text:
          "Create conversion-focused pages in minutes – " +
          "no coding required.",
      },
      smartdomain: {
        title: "SmartDomain",
        label: "Coming soon",
        text:
          "Your own domain, SSL & privacy – everything from one place, " +
          "GDPR-compliant and hosted in Europe.",
      },
      smartlinks: {
        title: "SmartLinks",
        label: "In progress",
