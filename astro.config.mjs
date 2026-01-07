import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// ⚙️ Moderne Astro-Config für Cloudflare Pages (2026)
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: "directory",
    platformProxy: {
      enabled: true, // nötig für Pages-Runtime
      include: ["SESSION"], // deine KV-Bindings
    },
  }),
  integrations: [solid(), tailwind()],
});
