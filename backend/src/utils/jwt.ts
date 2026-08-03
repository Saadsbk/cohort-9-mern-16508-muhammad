import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "./env.ts";

export function hashToken(token: string): string {
	return crypto.createHash("sha256").update(token).digest("hex");
}

const ACCESS_SECRET = env.JWT_ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = env.JWT_REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = env.JWT_ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = env.JWT_REFRESH_TOKEN_EXPIRY;
const REFRESH_TOKEN_MAX_AGE_MS = env.JWT_REFRESH_TOKEN_MAX_AGE_MS;

export type TokenPayload = { userId: string };

function assertTokenPayload(decoded: unknown): TokenPayload {
	if (typeof decoded !== "object" || decoded === null || typeof (decoded as Record<string, unknown>).userId !== "string") {
		throw new jwt.JsonWebTokenError("Token payload is malformed");
	}
	return decoded as TokenPayload;
}

export { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_MAX_AGE_MS };

export function generateAccessToken(userId: string) {
	return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(userId: string) {
	return jwt.sign({ userId, jti: crypto.randomUUID() }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
} // Added jti for edge cases where 2 tokens (for the same user) are generated at the same thime

export function verifyAccessToken(token: string): TokenPayload {
	return assertTokenPayload(jwt.verify(token, ACCESS_SECRET));
}

export function verifyRefreshToken(token: string): TokenPayload {
	return assertTokenPayload(jwt.verify(token, REFRESH_SECRET));
}