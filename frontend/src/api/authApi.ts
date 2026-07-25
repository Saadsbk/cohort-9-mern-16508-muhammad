import axios from "axios";
import type { SignInFormValues } from "@/schemas/signInSchema";
import type { SignUpFormValues } from "@/schemas/signUpSchema";
import stripAxiosError from "@/lib/errorHandlers";

/**
 * Signs in a user with SignInFormValues and returns the backend response payload.
 */
export async function signInUser(data: SignInFormValues) {
	try {
		const response = await axios.post("/api/auth/sign-in", data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(stripAxiosError(error, "Unable to sign in"), {
				cause: error,
			});
		}

		throw error;
	}
}

/**
 * Signs up a user with SignUpFormValues and returns the backend response payload.
 */
export async function signUpUser(data: SignUpFormValues) {
	try {
		const response = await axios.post("/api/auth/sign-up", data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(stripAxiosError(error, "Unable to sign up"), {
				cause: error,
			});
		}

		throw error;
	}
}
