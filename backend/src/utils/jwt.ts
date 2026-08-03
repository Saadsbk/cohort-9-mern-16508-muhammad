import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "./env.ts";

const ACCESS_SECRET = env.JWT_ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = env.JWT_REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = env.JWT_ACCESS_TOKEN_EXPIRY as NonNullable<SignOptions["expiresIn"]>;
const REFRESH_TOKEN_EXPIRY = env.JWT_REFRESH_TOKEN_EXPIRY as NonNullable<SignOptions["expiresIn"]>;
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
	return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): TokenPayload {
	return assertTokenPayload(jwt.verify(token, ACCESS_SECRET));
}

export function verifyRefreshToken(token: string): TokenPayload {
	return assertTokenPayload(jwt.verify(token, REFRESH_SECRET));
}