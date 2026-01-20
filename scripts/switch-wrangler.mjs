// scripts/switch-wrangler.mjs
import fs from "fs";

const isCloudflarePages = process.env.CF_PAGES === "1";

if (isCloudflarePages) {
  if (fs.existsSync("wrangler.pages.toml")) {
    fs.copyFileSync("wrangler.pages.toml", "wrangler.toml");
    console.log("✅ Cloudflare Pages erkannt → wrangler.pages.toml aktiviert.");
  } else {
    console.warn("⚠️ wrangler.pages.toml nicht gefunden!");
  }
} else {
  console.log("🧱 Lokales Deployment → Standard wrangler.toml aktiv.");
}
