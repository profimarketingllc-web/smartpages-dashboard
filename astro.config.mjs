import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// ============================================================
// ⚙️ ASTRO CONFIGURATION (SmartPages Dashboard v5.8)
// ------------------------------------------------------------
// ✅ SSR aktiviert (output: "server")
// ✅ Cloudflare Directory Mode für Pages Functions
// ✅ Solid + Tailwind integriert
// ✅ Automatische Sessions (SESSION, AUTH_DB, CORE_DB via Pages-Bindings)
// ✅ Fix: Vite Alias (~) für Build-Kompatibilität
// ============================================================

export default defineConfig({
  output: "server",

  image: {
    service: {
      entrypoint: "astro/assets/services/compile",
    },
  },

  adapter: cloudflare({
    mode: "directory",
    platformProxy: {
      enabled: true,
      // 👉 Cloudflare Pages liefert Bindings automatisch
    },
  }),

  integrations: [solid(), tailwind()],

  // 🧩 Middleware für User-Sessions aktivieren
  middleware: ["src/middleware/user-session.ts"],

  vite: {
    ssr: {
      noExternal: ["@astrojs/cloudflare", "@astrojs/solid-js"],
    },
    resolve: {
      alias: {
        "~": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
