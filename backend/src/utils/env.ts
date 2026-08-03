import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";
dotenv.config();

function getRequiredEnv(key: string): string {
	const val = process.env[key];
	if (!val || val.trim() === "") {
		throw new Error(`Environment variable ${key} is required but missing or empty.`);
	}
	return val;
}

function validateExpiry(val: string | undefined, defaultVal: string, keyName: string): NonNullable<SignOptions["expiresIn"]> {
	const raw = (val ?? defaultVal).trim();
	if (!raw) {
		throw new Error(`Environment variable ${keyName} is invalid or empty.`);
	}
	const num = Number(raw);
	if (!Number.isNaN(num)) {
		if (num < 0) {
			throw new Error(`Environment variable ${keyName} must be non-negative.`);
		}
		return num;
	}
	const durationPattern = /^\d+\s*(s|m|h|d|w|y|seconds?|minutes?|hours?|days?|weeks?|years?)$/i;
	if (!durationPattern.test(raw)) {
		throw new Error(`Environment variable ${keyName} has an invalid duration format: "${raw}".`);
	}
	return raw as NonNullable<SignOptions["expiresIn"]>;
}

const accessSecret = getRequiredEnv("JWT_ACCESS_TOKEN_SECRET");
const refreshSecret = getRequiredEnv("JWT_REFRESH_TOKEN_SECRET");

if (accessSecret === refreshSecret) {
	throw new Error("JWT_ACCESS_TOKEN_SECRET and JWT_REFRESH_TOKEN_SECRET must be different.");
}

const accessTokenExpiry = validateExpiry(process.env.JWT_ACCESS_TOKEN_EXPIRY, "15m", "JWT_ACCESS_TOKEN_EXPIRY");
const refreshTokenExpiry = validateExpiry(process.env.JWT_REFRESH_TOKEN_EXPIRY, "7d", "JWT_REFRESH_TOKEN_EXPIRY");

function getPositiveIntEnv(key: string, fallback: number): number {
	const raw = process.env[key];
	if (raw === undefined || raw.trim() === "") {
		return fallback;
	}
	if (!/^\d+$/.test(raw.trim())) {
		throw new Error(`Environment variable ${key} must be a positive integer number of milliseconds.`);
	}
	const parsed = Number.parseInt(raw, 10);
	if (parsed <= 0) {
		throw new Error(`Environment variable ${key} must be greater than zero.`);
	}
	return parsed;
}

const refreshTokenMaxAgeMs = getPositiveIntEnv("JWT_REFRESH_TOKEN_MAX_AGE_MS", 7 * 24 * 60 * 60 * 1000);
const tokenCleanupIntervalMs = getPositiveIntEnv("TOKEN_CLEANUP_INTERVAL_MS", 60 * 60 * 1000);

export const env = {
	DATABASE_URL: getRequiredEnv("DATABASE_URL"),
	JWT_ACCESS_TOKEN_SECRET: accessSecret,
	JWT_REFRESH_TOKEN_SECRET: refreshSecret,
	JWT_ACCESS_TOKEN_EXPIRY: accessTokenExpiry,
	JWT_REFRESH_TOKEN_EXPIRY: refreshTokenExpiry,
	JWT_REFRESH_TOKEN_MAX_AGE_MS: refreshTokenMaxAgeMs,
	TOKEN_CLEANUP_INTERVAL_MS: tokenCleanupIntervalMs,
	PORT: process.env.PORT ?? "3000",
	NODE_ENV: process.env.NODE_ENV ?? "development",
	FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",
	BACKEND_URL: process.env.BACKEND_URL,
};
