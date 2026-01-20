import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// 🔧 Automatische Erkennung der Umgebung
const isCloudflare = process.env.CF_PAGES === "1" || process.env.CF_ACCOUNT_ID;

export default defineConfig({
  output: "server",

  adapter: cloudflare({
    // Wenn auf Cloudflare (Pages oder Worker), dann Server-Mode
    mode: isCloudflare ? "directory" : "advanced",
    functionPerRoute: isCloudflare, // wichtig für Pages
    platformProxy: { enabled: false },
    imageService: "compile", // Bilder werden beim Build kompiliert
  }),

  image: {
    service: { entrypoint: "astro/assets/services/compile" },
  },

  integrations: [solid(), tailwind()],

  vite: {
    ssr: {
      noExternal: [
        "@astrojs/cloudflare",
        "@astrojs/solid-js",
      ],
    },
    resolve: {
      alias: {
        "~": new URL("./src", import.meta.url).pathname,
        "@middleware": new URL("./src/middleware", import.meta.url).pathname,
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    },
  },

  // 🟢 Wichtig: Middleware muss in `server` stehen (nicht top-level)
  server: {
    middleware: [
      "@middleware/lang",        // deine Sprach-Middleware
      "@middleware/user-session" // User-Session-Middleware
    ],
  },
});
