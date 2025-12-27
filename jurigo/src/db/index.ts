import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️  DATABASE_URL not set. Database operations will fail.");
}

const client = connectionString ? postgres(connectionString) : null;
export const db = client ? drizzle(client, { schema }) : null as any;

export * from "./schema";
