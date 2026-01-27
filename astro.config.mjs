import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",

  integrations: [
    solid(),
    tailwind(),
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
