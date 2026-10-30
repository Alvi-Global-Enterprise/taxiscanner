/**
 * @deprecated Prefer: node scripts/generate-uk-zones.mjs
 * Copies frontend JSON catalogue to the Laravel backend.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendJson = path.join(__dirname, "../src/data/uk_town_zones.json");
const backendPath = path.resolve(
  __dirname,
  "../../../TaxiScannerBackend-Github/taxiscannerbackend/config/data/uk_town_zones.json"
);

if (!fs.existsSync(frontendJson)) {
  console.error("Missing", frontendJson, "— run: node scripts/generate-uk-zones.mjs");
  process.exit(1);
}

const raw = fs.readFileSync(frontendJson, "utf8");
const zones = JSON.parse(raw);
fs.mkdirSync(path.dirname(backendPath), { recursive: true });
fs.writeFileSync(backendPath, JSON.stringify(zones, null, 2) + "\n");
console.log("Wrote", backendPath);
console.log("zones", zones.length);
