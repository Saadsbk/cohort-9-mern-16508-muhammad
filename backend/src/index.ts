import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres(process.env.DATABASE_URL!, {
	ssl: "require",
	prepare: false,
});

export const db = drizzle({ client: queryClient });