import type { CookieOptions, NextFunction, Request, Response } from "express";
import {
	type SignInFormValues as SignInInput,
	type SignUpFormValues as SignUpInput,
} from "../models/auth.model.ts";
import {
	type ApiResponse,
	createSuccessResponse,
} from "../utils/apiResponse.ts";
import {
	type SignInResult,
	type SignUpResult,
	signInService,
	signUpService,
	refreshTokenService,
	logoutService,
	deleteUserService,
} from "../services/auth.service.ts";
import { ApiError } from "../utils/apiError.ts";
import { REFRESH_TOKEN_MAX_AGE_MS } from "../utils/jwt.ts";

const getCookieOptions = (): CookieOptions => ({
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
	maxAge: REFRESH_TOKEN_MAX_AGE_MS,
});

/**
 * Handles user sign-in requests.
 * @param req - The incoming request with params of type `Record<string, never>` and body of type {@link SignInInput}.
 * @param res - The response object of type {@link ApiResponse}<{@link SignInResult}>.
 * @param next - Passes control to the next middleware or error handler.
 */
export const signInController = async (
	req: Request<Record<string, never>, unknown, SignInInput>,
	res: Response<ApiResponse<Omit<SignInResult, 'refreshToken'>>>,
	next: NextFunction,
): Promise<void> => {
	try {
		const payload = req.body;
		const result = await signInService(payload);
		const { refreshToken, ...rest } = result;

		res.cookie("refreshToken", refreshToken, getCookieOptions());

		res.status(200).json(createSuccessResponse(result.message, rest));
	} catch (error) {
		next(error);
	}
};

/**
 * Handles user sign-up requests.
 * @param req - The incoming request with params of type `Record<string, never>` and body of type {@link SignUpInput}.
 * @param res - The response object of type {@link ApiResponse}<{@link SignUpResult}>.
 * @param next - Passes control to the next middleware or error handler.
 */
export const signUpController = async (
	req: Request<Record<string, never>, unknown, SignUpInput>,
	res: Response<ApiResponse<SignUpResult>>,
	next: NextFunction,
): Promise<void> => {
	try {
		const payload = req.body;
		const result = await signUpService(payload);

		res.status(201).json(createSuccessResponse(result.message, result));
	} catch (error) {
		next(error);
	}
};



export const refreshTokenController = async (
	req: Request,
	res: Response<ApiResponse<{ accessToken: string }>>,
	next: NextFunction,
): Promise<void> => {
	try {		
		const refreshToken = req.cookies.refreshToken;
		// console.log("Refresh Token from Cookie:", refreshToken);	
		
		if (!refreshToken) {
			throw new ApiError(401, "Refresh token not provided");
		}

		const { accessToken, refreshToken: newRefreshToken } = await refreshTokenService(refreshToken);	

		res.cookie("refreshToken", newRefreshToken, getCookieOptions());

		res.status(200).json(createSuccessResponse("Token refreshed successfully", { accessToken }));

	}catch (error) {
		next(error);
	}	
}



export const logoutController = async (
	req: Request,
	res: Response<ApiResponse<null>>,
	next: NextFunction,
): Promise<void> => {
	try {		
		const refreshToken = req.cookies.refreshToken;

		if (refreshToken) {
			await logoutService(refreshToken);
		}
		
		const { httpOnly, secure, sameSite } = getCookieOptions();
		res.clearCookie("refreshToken", { httpOnly, secure, sameSite });
		res.status(200).json(createSuccessResponse("Logged out successfully", null));
	} catch (error) {
		next(error);
	}
};

export const deleteUserController = async (
	req: Request,
	res: Response<ApiResponse<null>>,
	next: NextFunction,
): Promise<void> => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			throw new ApiError(401, "Refresh token not provided");
		}

		await deleteUserService(refreshToken);

		const { httpOnly, secure, sameSite } = getCookieOptions();
		res.clearCookie("refreshToken", { httpOnly, secure, sameSite });
		res.status(200).json(createSuccessResponse("User deleted successfully", null));
	} catch (error) {
		next(error);
	}
};