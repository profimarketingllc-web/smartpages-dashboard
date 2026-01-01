import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import solid from "@astrojs/solid-js"; // ✅ SolidJS-Integration hinzufügen
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
    // ✅ SolidJS aktivieren (muss vor Tailwind stehen, damit Hydration korrekt läuft)
    solid(),
    tailwind({
      config: path.resolve("./tailwind.config.cjs"),
      applyBaseStyles: true,
    }),
  ],
});
