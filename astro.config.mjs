import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",

  adapter: cloudflare({
    mode: "directory", // 🧩 erzwingt .output/functions
    functionPerRoute: true, // wichtig für Cloudflare Pages
    platformProxy: { enabled: false },
  }),

  image: {
    service: { entrypoint: "astro/assets/services/compile" },
  },

  integrations: [solid(), tailwind()],

  vite: {
    ssr: {
      noExternal: ["@astrojs/cloudflare", "@astrojs/solid-js"],
    },
    resolve: {
      alias: {
        "~": new URL("./src", import.meta.url).pathname,
        "@middleware": new URL("./src/middleware", import.meta.url).pathname,
      },
    },
  },
});
