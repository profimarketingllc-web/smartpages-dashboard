import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: "directory",
    // ❌ Entferne das Binding — Cloudflare Pages setzt es automatisch
  }),
  integrations: [solid(), tailwind()],
});
