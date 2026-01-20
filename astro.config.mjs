import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",

  adapter: cloudflare({
    // Erzwinge den neuen Directory-Mode für Cloudflare Pages SSR
    mode: "directory",
    platformProxy: {
      enabled: false, // <<< muss aus sein, sonst fällt er zurück auf dist!
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
        "@middleware": new URL("./src/middleware", import.meta.url).pathname,
      },
    },
  },
});
