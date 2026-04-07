import pg from "pg";
import { createApiApp } from "./createApiApp.js";

const PORT = Number(process.env.PORT ?? 8788);
const DATABASE_URL = process.env.DATABASE_URL ?? "";

let pool: pg.Pool | null = null;
if (DATABASE_URL) {
  pool = new pg.Pool({ connectionString: DATABASE_URL });
}

const app = createApiApp({ pool });

app.listen(PORT, () => {
  console.info(`[api] http://localhost:${PORT}`);
});
