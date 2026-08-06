import axios from "axios";
import api from "./axiosClient";
import type { SignInFormValues } from "@/schemas/signInSchema";
import type { SignUpFormValues } from "@/schemas/signUpSchema";
import type { ApiSuccessResponse } from "@/types";
import stripAxiosError from "@/lib/errorHandlers";

// May change during develpment
export type SignInResponse = {
	accessToken: string;
	user: { id: string; username: string; email: string };
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
		const response = await api.post<ApiSuccessResponse<SignInResponse>>("/api/auth/sign-in", data);
		return response.data.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(stripAxiosError(error, error.message), {
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
		const response = await api.post<ApiSuccessResponse<SignUpResponse>>("/api/auth/sign-up", data);
		return response.data.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(stripAxiosError(error, error.message), {
				cause: error,
			});
		}

		throw error;
	}
}

/**
 * Logs out the current user by clearing the backend session and refresh token cookie.
 */
export async function logoutUser(): Promise<void> {
	try {
		await api.post("/api/auth/logout");
	} catch (error) {
		console.error("Logout request failed on server:", error);
	}
}

