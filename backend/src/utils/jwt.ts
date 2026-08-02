import jwt, { type SignOptions } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || "refresh-secret";
const ACCESS_TOKEN_EXPIRY = (process.env.JWT_ACCESS_TOKEN_EXPIRY ?? "15m");
const REFRESH_TOKEN_EXPIRY = (process.env.JWT_REFRESH_TOKEN_EXPIRY ?? "7d");
const REFRESH_TOKEN_MAX_AGE_MS = Number.parseInt(
	process.env.JWT_REFRESH_TOKEN_MAX_AGE_MS ?? String(7 * 24 * 60 * 60 * 1000),
	10,
);

export { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_MAX_AGE_MS };

export function generateAccessToken(userId: string) {
	return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY } as SignOptions);
}

export function generateRefreshToken(userId: string) {
	return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY } as SignOptions);
}

export function verifyAccessToken(token: string) {
	return jwt.verify(token, ACCESS_SECRET) as { userId: string }; // throws an error if the token is invalid or expired
}

export function verifyRefreshToken(token: string) {
	return jwt.verify(token, REFRESH_SECRET) as { userId: string }; // throws an error if the token is invalid or expired
}