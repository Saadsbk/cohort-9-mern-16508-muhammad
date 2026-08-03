import {
	type SignInFormValues as SignInInput,
	type SignUpFormValues as SignUpInput,
} from "../models/auth.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { db } from "../index.ts";
import { users, refreshTokens } from "../db/schema/schema.ts";
import { and, eq, gt, lt, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, REFRESH_TOKEN_MAX_AGE_MS, verifyRefreshToken } from "../utils/jwt.ts";
import jwt from "jsonwebtoken";
import { env } from "../utils/env.ts";

export type AuthUser = {
	id: string;
	email: string;
	password: string;
	username: string;
};

type AuthResult = {
	message: string;
	user: Omit<AuthUser, "password">;
};

export type SignInResult = AuthResult & {
	accessToken: string;
	refreshToken: string;
};

export type SignUpResult = Omit<AuthResult, "user"> & {
	userId: AuthResult["user"]["id"];
	message: string;
};

/**
 * Deletes refresh token records whose expiration time is earlier than current time.
 */
export async function cleanupExpiredTokens(): Promise<number> {
	try {
		const deleted = await db.delete(refreshTokens).where(lt(refreshTokens.expiresAt, new Date())).returning();
		return deleted.length;
	} catch (error) {
		console.error("Error cleaning up expired refresh tokens:", error);
		return 0;
	}
}

let cleanupTimer: NodeJS.Timeout | null = null;

/**
 * Starts the periodic background cleanup timer for expired refresh tokens.
 */
export function startTokenCleanup(): NodeJS.Timeout | null {
	if (!cleanupTimer) {
		cleanupTimer = setInterval(() => {
			cleanupExpiredTokens().catch((err) => {
				console.error("Periodic token cleanup failed:", err);
			});
		}, env.TOKEN_CLEANUP_INTERVAL_MS);

		if (cleanupTimer.unref) {
			cleanupTimer.unref();
		}
	}
	return cleanupTimer;
}

const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8pM3rQ8pM3rQ8pM3rQ8pM3rQ8pM3rQ";

/**
 * Authenticates a user using the provided sign-in credentials.
 * @param payload - The sign-in input data of type {@link SignInInput}.
 * @returns A promise resolving to {@link SignInResult}.
 * @throws An {@link ApiError} When the credentials are invalid.
 */
export async function signInService(
	payload: SignInInput,
): Promise<SignInResult> {
	try {
		const [user] = await db.select().from(users).where(eq(users.username, payload.username));
		const isPasswordCorrect = await bcrypt.compare(payload.password, user?.passwordHash ?? DUMMY_HASH);
		if (!user || !isPasswordCorrect) {
			throw new ApiError(401, "Invalid credentials");
		}
		
		const accessToken = generateAccessToken(user.id);
		const refreshToken = generateRefreshToken(user.id);

		const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS);	
		await db.insert(refreshTokens).values({ token: refreshToken, userId: user.id, expiresAt });

		return {
			accessToken: accessToken,
			refreshToken: refreshToken,
			message: "Signed in successfully",
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
			},
		};
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "Error occurred while signing in", null, error);
	}
}

/**
 * Registers a new user with the provided sign-up payload.
 * @param payload - The sign-up input data of type {@link SignUpInput}.
 * @returns A promise resolving to {@link SignUpResult}.
 * @throws An {@link ApiError} When the email or username already exists.
 */
export async function signUpService(
	payload: SignUpInput,
): Promise<SignUpResult> {
	try {
		const [user] = await db.select().from(users).where(or(eq(users.username, payload.username), eq(users.email, payload.email)));

		if (user) {
			throw new ApiError(400, "User already exists");
		}

		const hashedPassword = await bcrypt.hash(payload.password, 10);

		const [newUser]: (typeof users.$inferSelect)[] = await db.insert(users)
			.values({
				email: payload.email,
				username: payload.username,
				passwordHash: hashedPassword,
			}).returning();

		if (!newUser) {
			throw new ApiError(500, "Failed to create user");
		}

		return {
			message: "Signed up successfully",
			userId: newUser.id,
		};
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		if (typeof error === "object" && error !== null && (error as { code?: string }).code === "23505") {
			throw new ApiError(400, "User already exists");
		}

		throw new ApiError(500, "Error occurred while signing up", null, error);
	}
}

export async function refreshTokenService(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
	try {
		if (!refreshToken) {
			throw new ApiError(401, "Refresh token not provided");
		}

		const payload = verifyRefreshToken(refreshToken);

		const [tokenRecord] = await db
			.select()
			.from(refreshTokens)
			.where(and(eq(refreshTokens.token, refreshToken), gt(refreshTokens.expiresAt, new Date())))
			.limit(1);
		
		if (!tokenRecord) {
			// The signature is valid but the row is gone or expired. Treat this as reuse of a
			// rotated token and revoke every session for the user.
			await db.delete(refreshTokens).where(eq(refreshTokens.userId, payload.userId));
			throw new ApiError(403, "Invalid refresh token");
		}

		const newAccessToken = generateAccessToken(tokenRecord.userId);
		const newRefreshToken = generateRefreshToken(tokenRecord.userId);
		const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS);
		
		await db.transaction(async (tx) => {
			const deleted = await tx.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken)).returning();
			if (deleted.length === 0) { // i.e. No row deleted = deplicate request or attack ==> nukes every active refresh token for that userId 
				await tx.delete(refreshTokens).where(eq(refreshTokens.userId, payload.userId));
				throw new ApiError(403, "Invalid refresh token");
			}
			await tx.insert(refreshTokens).values({ token: newRefreshToken, userId: tokenRecord.userId, expiresAt });
		});

		return { accessToken: newAccessToken, refreshToken: newRefreshToken };

	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		if (error instanceof jwt.TokenExpiredError) {
			throw new ApiError(401, "Refresh token has expired");
		}

		if (error instanceof jwt.JsonWebTokenError) {
			throw new ApiError(403, "Invalid refresh token");
		}

		throw new ApiError(500, "Error occurred while refreshing token", null, error);
	}
}


export async function logoutService(refreshToken: string): Promise<void> {
	try {
		await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
	} catch (error) {
		throw new ApiError(500, "Error occurred while logging out", null, error);
	}
}

export async function deleteUserService(refreshToken: string, password: string): Promise<void> {
	try {
		if (!refreshToken) {
			throw new ApiError(401, "Refresh token not provided");
		}

		const payload = verifyRefreshToken(refreshToken);

		const [tokenRecord] = await db
			.select()
			.from(refreshTokens)
			.where(and(eq(refreshTokens.token, refreshToken), gt(refreshTokens.expiresAt, new Date())))
			.limit(1);

		if (!tokenRecord) {
			throw new ApiError(403, "Invalid refresh token");
		}

		if (!password || typeof password !== "string" || password.length === 0) {
			throw new ApiError(400, "Password is required");
		}

		const [user] = await db.select().from(users).where(eq(users.id, tokenRecord.userId)).limit(1);
		const isPasswordValid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
		if (!user || !isPasswordValid) {
			throw new ApiError(401, "Invalid credentials");
		}

		await db.transaction(async (tx) => {
			await tx.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
			await tx.delete(users).where(eq(users.id, payload.userId));
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		if (error instanceof jwt.TokenExpiredError) {
			throw new ApiError(401, "Refresh token has expired");
		}

		if (error instanceof jwt.JsonWebTokenError) {
			throw new ApiError(403, "Invalid refresh token");
		}

		throw new ApiError(500, "Error occurred while deleting user", null, error);
	}
}