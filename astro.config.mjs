import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  // 🔒 STATIC OUTPUT – kein SSR, kein HTML-Parser-Bug
  output: "static",

  // 🌱 Kein Adapter nötig bei static
  // Cloudflare Pages kann static direkt hosten

  integrations: [
    solid(),
    tailwind()
  ],

  vite: {
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
        "~": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
