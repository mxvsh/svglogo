import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "cloudflare:workers";
import * as schema from "../../drizzle/schema";

export function getDb() {
  const client = postgres(env.DATABASE_URL, { max: 1, prepare: false, idle_timeout: 0 });
  return drizzle(client, { schema });
}
