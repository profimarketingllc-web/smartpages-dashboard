import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// ============================================================
// ⚙️ ASTRO CONFIGURATION (SmartPages Dashboard v5.16)
// ------------------------------------------------------------
// ✅ SSR aktiviert (output: "server")
// ✅ Cloudflare Directory Mode (Pages Functions)
// ✅ SolidJS + Tailwind integriert
// ✅ Middleware automatisch erkannt (user-session + lang)
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
      include: ["SESSION", "AUTH_DB", "CORE_DB"],
    },
  }),

  integrations: [solid(), tailwind()],

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
