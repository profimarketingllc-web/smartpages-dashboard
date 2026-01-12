import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server", // <-- zwingt SSR statt Static Export
  image: {
    service: "astro/assets/services/compile", // <-- hier aktivieren
  },
  adapter: cloudflare({
    mode: "directory",
    platformProxy: {
      enabled: true,
      include: ["SESSION"], // falls du KV nutzt
    },
  }),
  integrations: [solid(), tailwind()],
  vite: {
    ssr: {
      // Verhindert, dass Astro statische Bundles statt SSR baut
      noExternal: ["@astrojs/cloudflare", "@astrojs/solid-js"],
    },
  },
});
