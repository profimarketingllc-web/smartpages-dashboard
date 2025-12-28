import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import path from "path";

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "~": path.resolve("./src"),  // Für Layouts, Seiten, Utilities
        "@": path.resolve("./src"),  // Für Komponenten (UI, Core, Editor)
      },
    },
  },
  integrations: [
    tailwind({
      config: path.resolve("./tailwind.config.cjs"), // Plattformunabhängig (Windows/Linux)
      applyBaseStyles: true,                         // aktiviert base + utilities
    }),
  ],
});
