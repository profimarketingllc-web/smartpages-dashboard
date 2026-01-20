import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// 🔧 Automatische Erkennung der Umgebung
const isCloudflare = process.env.CF_PAGES === "1" || process.env.CF_ACCOUNT_ID;

export default defineConfig({
  output: "server",

  adapter: cloudflare({
    mode: isCloudflare ? "directory" : "advanced",
    functionPerRoute: isCloudflare,
    platformProxy: { enabled: false },
    imageService: "compile",
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
});
