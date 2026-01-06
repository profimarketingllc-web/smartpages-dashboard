import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: "directory",
    platformProxy: {
      enabled: true, // 🔧 sorgt dafür, dass Astro auf Cloudflare Pages Worker richtig läuft
    },
  }),
  integrations: [solid(), tailwind()],
});
