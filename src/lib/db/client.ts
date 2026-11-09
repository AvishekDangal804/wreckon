import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// No DATABASE_URL yet (no Postgres account configured) → `db` is null and every
// caller must skip persistence rather than throw, matching the Resend-or-log
// fallback already used in src/pages/api/enquiry.ts.
const databaseUrl = import.meta.env.DATABASE_URL;

export const db = databaseUrl ? drizzle(neon(databaseUrl), { schema }) : null;
