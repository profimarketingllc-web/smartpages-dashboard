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
  platformProxy: {
    enabled: true,
    bindings: {
      SESSION: "SESSIONS", // 👈 Mappt Cloudflare-Binding auf Astro-Erwartung
    },
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
      noExternal: ["astro"], // Stabilität für Middleware & SSR
    },
  },

  // 🧱 Integrationen (Solid zuerst!)
  integrations: [
    solid(),
    tailwind({
      config: path.resolve("./tailwind.config.cjs"),
      applyBaseStyles: true,
    }),
  ],
});
