import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL required");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
const schema = readFileSync(join(__dirname, "../sql/schema.sql"), "utf8");
const seedPhrases = readFileSync(join(__dirname, "../sql/seed_chat_phrases.sql"), "utf8");

await client.connect();
await client.query(schema);
await client.query(seedPhrases);
await client.end();
console.info("Migration applied.");
