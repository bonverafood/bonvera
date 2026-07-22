import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/config/env";
import * as schema from "@/lib/db/schema";

/**
 * Drizzle client for server-side use only.
 * Requires DATABASE_URL (Supabase Postgres connection string).
 */
const globalForDb = globalThis as unknown as {
  postgresClient: ReturnType<typeof postgres> | undefined;
};

function createDrizzleClient() {
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL");
  }

  const client =
    globalForDb.postgresClient ??
    postgres(databaseUrl, {
      prepare: false,
      max: 1,
    });

  if (env.NODE_ENV !== "production") {
    globalForDb.postgresClient = client;
  }

  return drizzle(client, { schema });
}

export const db = new Proxy({} as ReturnType<typeof createDrizzleClient>, {
  get(_target, property, receiver) {
    const client = createDrizzleClient();
    return Reflect.get(client, property, receiver);
  },
});
