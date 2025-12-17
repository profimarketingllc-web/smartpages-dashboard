import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import path from "path";

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "~": path.resolve("./src"),
      },
    },
  },
  integrations: [
    tailwind({
      config: "./tailwind.config.cjs", // oder .js, je nachdem was du nutzt
      applyBaseStyles: true, // aktiviert base + utilities
    }),
  ],
});
