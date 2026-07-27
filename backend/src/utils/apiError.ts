export class ApiError extends Error {
	readonly statusCode: number;
	readonly details?: unknown;

	constructor(
		statusCode: number,
		message: string,
		details?: unknown,
		cause?: unknown,
		name = "ApiError",
	) {
		super(message, { cause });
		this.name = name;
		this.statusCode = statusCode;
		this.details = details;
	}
}
