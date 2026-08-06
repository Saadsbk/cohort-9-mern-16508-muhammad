import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import useAuth from "@/store/auth";
import type { ApiSuccessResponse } from "@/types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

const api = axios.create({
	baseURL: BACKEND_URL,
	withCredentials: true, // Send HttpOnly cookies (e.g. refreshToken)
});

// Attach Zustand access token to every outgoing request
api.interceptors.request.use(
	function (config) {
		const token = useAuth.getState().accessToken;
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	function (error) {
		console.log("Request Error: ", error);
		return Promise.reject(error);
	},
);

// Catch 401 errors and request a new token via refresh endpoint
api.interceptors.response.use(
	function (response) {
		return response;
	},
	async function (error: AxiosError) {
		console.log("Response Error: ", error);

		const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

		// Do not attempt refresh on auth endpoints (sign-in, sign-up, refresh-token)
		const isAuthEndpoint =
			originalRequest?.url?.includes("/api/auth/sign-in") ||
			originalRequest?.url?.includes("/api/auth/sign-up") ||
			originalRequest?.url?.includes("/api/auth/refresh-token");

		if (
			error.response?.status === 401 &&
			originalRequest && !originalRequest._retry &&
			!isAuthEndpoint
		) {
			originalRequest._retry = true;

			try {
				const response = await axios.post<ApiSuccessResponse<{ accessToken: string }>>(
					`${BACKEND_URL}/api/auth/refresh-token`,
					{},
					{ withCredentials: true },
				);

				const newAccessToken = response.data.data.accessToken;

				// Update Zustand store with the new access token
				useAuth.getState().actions.setAccessToken(newAccessToken);

				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				}

				return api(originalRequest);
			} catch (refreshError) {
				// Log out user if refresh token is expired or invalid
				useAuth.getState().actions.logout();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
