import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";
import { createErrorResponse, type ApiResponse } from "../utils/apiResponse.ts";
import { ZodError, z } from "zod";

/**
 * Handles requests that do not match any registered route.
 * @param _req - The incoming request object (Not used)
 * @param _res - The outgoing response object (Not used)
 * @param next - Passes control to the next error handler with {@link ApiError}.
 */
export const notFoundHandler = (
	_req: Request,
	_res: Response,
	next: NextFunction,
): void => {
	next(new ApiError(404, "Route not found"));
};

/**
 * Handles application and route errors and returns a standardized API error response.
 * @param error - The error that was thrown or passed to the middleware.
 * @param _req - The incoming request object (Not used)
 * @param res - The outgoing response object of type ApiResponse<never>.
 * @param _next - Passes control to the next middleware (Not used)
 */
export const errorHandler: ErrorRequestHandler = (
	error: unknown,
	_req: Request,
	res: Response<ApiResponse<never>>,
	_next: NextFunction,
): void => {
	const isApiError = error instanceof ApiError || (typeof error === "object" && error !== null && typeof (error as { statusCode?: number }).statusCode === "number");
	const statusCode = isApiError ? (error as ApiError).statusCode : 500;
	const message = isApiError ? (error as ApiError).message : "Internal Server Error";
	const details = isApiError ? (error as ApiError).details : undefined;

	if (error instanceof ZodError) {
		const apiError = new ApiError(
			400,
			"Validation Failed",
			z.treeifyError(error),
			error,
		);

		res
			.status(apiError.statusCode)
			.json(createErrorResponse(apiError.message, apiError.details));
		return;
	}

	if (!isApiError) {
		console.error("Unhandled Server Error:", error);
	}

	res.status(statusCode).json(createErrorResponse(message, details));
};