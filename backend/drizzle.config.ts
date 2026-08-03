import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config()

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl.trim() === "") {
	throw new Error("Environment variable DATABASE_URL is required but missing or empty.");
}

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema/*.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl,
	},
});
