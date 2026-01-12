import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server", // <-- SSR aktivieren
  image: {
    service: {
      entrypoint: "astro/assets/services/compile", // ✅ neue Syntax
    },
  },
  adapter: cloudflare({
    mode: "directory",
    platformProxy: {
      enabled: true,
      include: ["SESSION"], // KV Binding
    },
  }),
  integrations: [solid(), tailwind()],
  vite: {
    ssr: {
      noExternal: ["@astrojs/cloudflare", "@astrojs/solid-js"],
    },
  },
});
