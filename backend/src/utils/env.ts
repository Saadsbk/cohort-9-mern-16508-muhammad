import dotenv from "dotenv";
dotenv.config();

function getRequiredEnv(key: string): string {
	const val = process.env[key];
	if (!val || val.trim() === "") {
		throw new Error(`Environment variable ${key} is required but missing or empty.`);
	}
	return val;
}

const accessSecret = getRequiredEnv("JWT_ACCESS_TOKEN_SECRET");
const refreshSecret = getRequiredEnv("JWT_REFRESH_TOKEN_SECRET");

if (accessSecret === refreshSecret) {
	throw new Error("JWT_ACCESS_TOKEN_SECRET and JWT_REFRESH_TOKEN_SECRET must be different.");
}

const parsedMaxAge = Number.parseInt(process.env.JWT_REFRESH_TOKEN_MAX_AGE_MS ?? "", 10);
const refreshTokenMaxAgeMs = Number.isNaN(parsedMaxAge) ? 7 * 24 * 60 * 60 * 1000 : parsedMaxAge;

const parsedCleanupInterval = Number.parseInt(process.env.TOKEN_CLEANUP_INTERVAL_MS ?? "", 10);
const tokenCleanupIntervalMs = Number.isNaN(parsedCleanupInterval) ? 60 * 60 * 1000 : parsedCleanupInterval;

export const env = {
	DATABASE_URL: getRequiredEnv("DATABASE_URL"),
	JWT_ACCESS_TOKEN_SECRET: accessSecret,
	JWT_REFRESH_TOKEN_SECRET: refreshSecret,
	JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY ?? "15m",
	JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY ?? "7d",
	JWT_REFRESH_TOKEN_MAX_AGE_MS: refreshTokenMaxAgeMs,
	TOKEN_CLEANUP_INTERVAL_MS: tokenCleanupIntervalMs,
	PORT: process.env.PORT ?? "3000",
	NODE_ENV: process.env.NODE_ENV ?? "development",
	FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",
	BACKEND_URL: process.env.BACKEND_URL,
};
