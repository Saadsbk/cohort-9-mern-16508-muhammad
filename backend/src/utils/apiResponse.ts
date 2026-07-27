export type ApiSuccessResponse<T> = {
	success: true;
	message: string;
	data: T;
};

export type ApiErrorResponse = {
	success: false;
	message: string;
	details?: unknown;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Creates a standardized success response payload.
 * @template T - The type of the response data (i.e. value of the `data` attribute).
 * @param message - The message of type `string` corresponding to the success.
 * @param data - The response data of type {@link T}.
 * @returns A success {@link ApiSuccessResponse}<{@link T}>.
 */
export function createSuccessResponse<T>(message: string, data: T): ApiSuccessResponse<T> {
	return {
		success: true,
		message,
		data,
	};
}

/**
 * Creates a standardized error response payload.
 * @param message - The message of type `string` corresponding to the error.
 * @param details - **Optional** error details of type `unknown`.
 * @returns An {@link ApiErrorResponse} object.
 */
export function createErrorResponse(message: string, details?: unknown): ApiErrorResponse {
	return {
		success: false,
		message,
		...(details === undefined ? {} : { details }),
	};
}