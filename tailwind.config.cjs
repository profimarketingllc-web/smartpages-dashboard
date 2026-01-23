/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      colors: {
        // 🟦 SmartPages CI Farbpalette
        'smart-dark': '#1E2A45',       // Struktur & Vertrauen
        'smart-red': '#C53A3A',        // Energie & Dynamik
        'smart-surface': '#F9F9F9',    // Hintergrundflächen
        'smart-text': '#111827',       // Standard-Textfarbe

        // 🎨 Produktfarben (Pastellfarben für UI-Flächen)
        'smart-pages': '#F9E293',      // SmartPages (Gelb, Kreativität)
        'smart-domains': '#C0A8F7',    // SmartDomains (Violett, Innovation)
        'smart-profile': '#A1D0F2',    // SmartProfile (Hellblau, Klarheit)
        'smart-links': '#A8D5BA',      // SmartLinks (Salbei, Natürlichkeit)
        'smart-billing': '#D9D9D9',    // SmartBilling (Silber, Neutralität)

        // 🌈 Akzentfarben (volle CI-Farben)
        'smart-full-pages': '#F2B623',    // SmartPages Akzent
        'smart-full-domains': '#6C3FD8',  // SmartDomains Akzent
        'smart-full-profile': '#2D83D0',  // SmartProfile Akzent
        'smart-full-links': '#7EA685',    // SmartLinks Akzent (kräftiger Salbei)
        'smart-full-billing': '#B0B0B0',  // SmartBilling Akzent (helles Silber)

        // ⚙️ Neutrale Töne & Feedbackfarben
        'smart-gray': '#E5E7EB',
        'smart-border': '#D1D5DB',
        'smart-success': '#4CAF50',
        'smart-warning': '#FFB020',
        'smart-error': '#EF4444',
      },

      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },

      fontSize: {
        h1: ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["1.875rem", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.4", fontWeight: "400" }],
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        card: "0 8px 30px rgba(0, 0, 0, 0.08)",
        focus: "0 0 0 3px rgba(78, 107, 255, 0.4)",
      },
    },
  },
  plugins: [],
};
