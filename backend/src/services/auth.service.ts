import {
	type SignInFormValues as SignInInput,
	type SignUpFormValues as SignUpInput,
} from "../models/auth.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { db } from "../index.ts";
import { users, refreshTokens } from "../db/schema/schema.ts";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, REFRESH_TOKEN_MAX_AGE_MS, verifyRefreshToken } from "../utils/jwt.ts";
import jwt from "jsonwebtoken";

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
 * Authenticates a user using the provided sign-in credentials.
 * @param payload - The sign-in input data of type {@link SignInInput}.
 * @returns A promise resolving to {@link SignInResult}.
 * @throws An {@link ApiError} When the credentials are invalid.
 */
export async function signInService(
	payload: SignInInput,
): Promise<SignInResult> {

	const [user] = await db.select().from(users).where(eq(users.username, payload.username));

	if (!user) {
		throw new ApiError(404, "User does not exist");
	}

	const isPasswordCorrect = await bcrypt.compare(payload.password,user.passwordHash);

	if (!isPasswordCorrect) {
		throw new ApiError(401, "Invalid credentials");
	}
	
	const accessToken = generateAccessToken(user.id);
	const refreshToken = generateRefreshToken(user.id);

	const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS);	
  await db.insert(refreshTokens).values({ token: refreshToken, userId: user.id, expiresAt });

	return {
		accessToken: accessToken,
		refreshToken : refreshToken,
		message: "Signed in successfully",
		user: {
			id: user.id,
			email: user.email,
			username: user.username,
		},
	};
}

/**
 * Registers a new user with the provided sign-up payload.
 * @param payload - The sign-up input data of type {@link SignUpInput}.
 * @returns A promise resolving to {@link SignUpResult}.
 * @throws An {@link ApiError} When the email already exists.
 */
export async function signUpService(
	payload: SignUpInput,
): Promise<SignUpResult> {
	const [user] = await db.select().from(users).where(or(eq(users.username, payload.username), eq(users.email, payload.email)),
		);

	if (user) {
		throw new ApiError(400, "User already exists");
	}

	const hashedPassword = await bcrypt.hash(payload.password, 10);

	const [newUser] = await db.insert(users)
		.values({
			email: payload.email,
			username: payload.username,
			passwordHash: hashedPassword,
		}).returning();

	return {
		message: "Signed up successfully",
		userId: newUser ? newUser.id : "",
	};
}

export async function refreshTokenService(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
	try {
		if (!refreshToken) {
			throw new ApiError(401, "Refresh token not provided");
		}

		const payload = verifyRefreshToken(refreshToken);
		// console.log("Payload from Refresh Token:", payload);

		const [tokenRecord] = await db
			.select()
			.from(refreshTokens)
			.where(eq(refreshTokens.token, refreshToken))
			.limit(1);
		
		if (!tokenRecord) {
			throw new ApiError(403, "Invalid refresh token");
		}

		const newAccessToken = generateAccessToken(tokenRecord.userId);
		const newRefreshToken = generateRefreshToken(tokenRecord.userId);
		const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS);
		
		await db.transaction(async (tx) => {
			await tx.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
			await tx.insert(refreshTokens).values({ token: newRefreshToken, userId: payload.userId, expiresAt});
		})

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

export async function deleteUserService(refreshToken: string): Promise<void> {
	try {
		if (!refreshToken) {
			throw new ApiError(401, "Refresh token not provided");
		}

		const payload = verifyRefreshToken(refreshToken);

		const [tokenRecord] = await db
			.select()
			.from(refreshTokens)
			.where(eq(refreshTokens.token, refreshToken))
			.limit(1);

		if (!tokenRecord) {
			throw new ApiError(403, "Invalid refresh token");
		}

		await db.transaction(async (tx) => {
			await tx.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
			await tx.delete(users).where(eq(users.id, payload.userId));
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		throw new ApiError(500, "Error occurred while deleting user", null, error);
	}
}