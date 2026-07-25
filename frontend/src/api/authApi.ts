import axios from "axios";
import type { SignInFormValues } from "@/schemas/signInSchema";
import type { SignUpFormValues } from "@/schemas/signUpSchema";
import stripAxiosError from "@/lib/errorHandlers";

// May change during develpment
export type SignInResponse = {
	token: string;
	user: { id: string; email: string };
	message?: string;
};

export type SignUpResponse = {
	userId: string;
	message: string;
};

/**
 * Signs in a user with SignInFormValues and returns the backend response payload.
 */
export async function signInUser(data: SignInFormValues): Promise<SignInResponse> {
try {
  const response = await axios.post<SignInResponse>("/api/auth/sign-in", data);
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
export async function signUpUser(data: SignUpFormValues): Promise<SignUpResponse> {
try {
  	const response = await axios.post<SignUpResponse>("/api/auth/sign-up", data);
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
