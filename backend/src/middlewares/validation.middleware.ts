import type { NextFunction, Request, Response, RequestHandler } from "express";
import type { ZodType } from "zod"; // Use ZodType instead of ZodAny for better safety
import { ApiError } from "../utils/apiError.ts";

/**
 * Middleware to validate request body against a Zod schema.
 * @param schema - The Zod schema to validate the request body against.
 * @returns A Express request handler.
 * @throws An {@link ApiError} with status code 400 if validation fails.
 */
export function validateBody(schema: ZodType): RequestHandler {
	return (req: Request, _res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const errorMessages = result.error.issues.map((issue) => {
				const field = issue.path.join(".");
				return `${field}: ${issue.message}`;
			});

			return next(
				new ApiError(
					400,
					"Validation failed",
					errorMessages.join("; "),
					result.error,
				),
			);
		}

		req.body = result.data;
		next();
	};
}
