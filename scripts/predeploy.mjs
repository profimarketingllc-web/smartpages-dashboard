import fs from "fs";
import path from "path";

const wranglerPath = path.resolve("./wrangler.toml");

if (!fs.existsSync(wranglerPath)) {
  console.error("❌ Keine wrangler.toml gefunden!");
  process.exit(1);
}

let wranglerConfig = fs.readFileSync(wranglerPath, "utf-8");

// Mögliche Build-Ausgabe-Pfade in neuer und alter Astro-Version
const pathsToCheck = [
  "dist/_worker.js",            // Cloudflare SSR (neu)
  ".output/server/entry.mjs",   // ältere Cloudflare Adapter
  "dist/server/entry.mjs",      // manuelle oder Legacy Astro
];

let mainPath = null;
for (const p of pathsToCheck) {
  if (fs.existsSync(p)) {
    mainPath = p;
    break;
  }
}

if (!mainPath) {
  console.error("⚠️ Kein passender Build-Output gefunden!");
  process.exit(1);
}

console.log(`🔧 Gefundener Build-Pfad: ${mainPath}`);

// Existierenden main-Eintrag aktualisieren
wranglerConfig = wranglerConfig.replace(/main\s*=\s*".*"/, `main = "${mainPath}"`);
fs.writeFileSync(wranglerPath, wranglerConfig);

console.log(`✅ wrangler.toml aktualisiert (${mainPath})`);
