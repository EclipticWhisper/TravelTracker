import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = pg;

const required = ["PGUSER", "PGHOST", "PGDATABASE", "PGPASSWORD", "PGPORT"];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[db] Missing environment variable ${key}`);
  }
}

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("[db] Unexpected error on idle PostgreSQL client", err.message);
  process.exit(1);
});

export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== "production") {
    console.log(`[db] ${text.split("\n")[0].trim()} (${duration}ms)`);
  }
  return result;
}
