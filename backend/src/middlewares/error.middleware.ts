import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";
import { createErrorResponse, type ApiResponse } from "../utils/apiResponse.js";

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
	const statusCode = error instanceof ApiError ? error.statusCode : 500;
	const message = error instanceof Error ? error.message : "Internal Server Error";
	const details = error instanceof ApiError ? error.details : undefined;

	res.status(statusCode).json(createErrorResponse(message, details));
};