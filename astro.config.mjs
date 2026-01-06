import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import solid from "@astrojs/solid-js";
import path from "path";

export default defineConfig({
  // 🧠 Server Rendering aktivieren – notwendig für Middleware, Locals & Tokens
  output: "server",

  // ⚙️ Cloudflare Adapter für SSR
  adapter: cloudflare({
    // optional: Anpassbar, wenn du spezielle Worker-Optionen brauchst
    platformProxy: {
      enabled: true,
    },
  }),

  // 🧩 Vite-Konfiguration (Alias-Pfade)
  vite: {
    resolve: {
      alias: {
        "~": path.resolve("./src"), // Layouts, Pages, Utilities
        "@": path.resolve("./src"), // Core-Komponenten, Shared UI
      },
    },
    ssr: {
      noExternal: ["astro"], // Stabilität für Middleware & SSR-Umgebung
    },
  },

  // 🧱 Integrationen (Reihenfolge beachten!)
  integrations: [
    // Solid muss VOR Tailwind geladen werden, damit Hydration funktioniert
    solid(),
    tailwind({
      config: path.resolve("./tailwind.config.cjs"),
      applyBaseStyles: true,
    }),
  ],

  // 🌍 Optional – falls du künftig i18n (Mehrsprachigkeit) direkt steuern willst
  experimental: {
    middleware: true, // Explizit aktivieren (empfohlen bei Cloudflare SSR)
  },
});
