import axios from "axios";

/**
 * Extracts an error message from an Axios authentication request error.
 */
export default function stripAxiosError(error: unknown, fallbackMessage: string) {
	if (axios.isAxiosError(error)) {
		const responseData = error.response?.data;


		if ( typeof responseData === "object" && responseData !== null && "message" in responseData ) {
			const message = (responseData as { message?: unknown }).message;

			if (typeof message === "string" && message.trim()) {
				return message;
			}
		}

		if (typeof responseData === "string" && responseData.trim()) {
			return responseData;
		}
	}

	return fallbackMessage;
}
