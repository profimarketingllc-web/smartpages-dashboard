import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: "directory",
    // 🧩 Wichtig: explizites KV-Binding
    bindings: {
      SESSION: "SESSIONS",
    },
  }),
  integrations: [solid(), tailwind()],
});
