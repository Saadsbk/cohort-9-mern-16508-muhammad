import type { NextFunction, Request, Response } from "express";
import {
	type SignInFormValues as SignInInput,
	type SignUpFormValues as SignUpInput,
} from "../models/auth.model.js";
import {
	type ApiResponse,
	createSuccessResponse,
} from "../utils/apiResponse.js";
import {
	type SignInResult,
	type SignUpResult,
	signInService,
	signUpService,
} from "../services/auth.service.js";


/**
 * Handles user sign-in requests.
 * @param req - The incoming request with params of type `Record<string, never>` and body of type {@link SignInInput}.
 * @param res - The response object of type {@link ApiResponse}<{@link SignInResult}>.
 * @param next - Passes control to the next middleware or error handler.
 */
export const signInController = async (
	req: Request<Record<string, never>, unknown, SignInInput>,
	res: Response<ApiResponse<SignInResult>>,
	next: NextFunction,
): Promise<void> => {
	try {
		const payload = req.body;
		const result = await signInService(payload);

		res.status(200).json(createSuccessResponse(result.message, result));
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
