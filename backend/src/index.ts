import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./utils/env.ts";

export const queryClient = postgres(env.DATABASE_URL, {
	ssl: "require",
	prepare: false,
});

export const db = drizzle({ client: queryClient });

export async function closeDb() {
	await queryClient.end();
}