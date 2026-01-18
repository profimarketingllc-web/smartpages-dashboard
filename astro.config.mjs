import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// ============================================================
// ⚙️ ASTRO CONFIGURATION (SmartPages Dashboard v5.8)
// ------------------------------------------------------------
// ✅ SSR aktiviert (output: "server")
// ✅ Cloudflare Directory Mode (Workers + D1 + R2)
// ✅ PlatformProxy für SSR Sessions
// ✅ Tailwind + Solid integriert
// ✅ Neue Syntax für Astro Image Service
// ============================================================

export default defineConfig({
  output: "server", // 🔥 SSR aktivieren (Server Rendering)
  
  image: {
    service: {
      entrypoint: "astro/assets/services/compile", // Neue Syntax (Astro ≥ 4.0)
    },
  },

  adapter: cloudflare({
    mode: "directory", // ⚡️ Kompatibel mit Cloudflare Pages Functions
    platformProxy: {
      enabled: true, // 🔐 Erlaubt Zugriff auf Cloudflare Bindings
      include: ["SESSION"], // z. B. KV, Durable Object, etc.
    },
  }),

  integrations: [
    solid(),     // 🧠 SolidJS Integration für Interaktive Komponenten
    tailwind(),  // 🎨 TailwindCSS für Styling
  ],

  vite: {
    ssr: {
      // 🚫 Verhindert Build-Fehler durch externe Module bei SSR
      noExternal: [
        "@astrojs/cloudflare",
        "@astrojs/solid-js"
      ],
    },
  },
});
