import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import useAuth from "@/store/auth";
import type { ApiSuccessResponse } from "@/types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "";
if (!BACKEND_URL && import.meta.env.PROD) {
	throw new Error("VITE_BACKEND_URL is not configured.");
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

const api = axios.create({
	baseURL: BACKEND_URL,
	timeout: 15000,
	withCredentials: true, // Send HttpOnly cookies (e.g. refreshToken)
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
	if (!refreshPromise) {
		refreshPromise = (async () => {
			try {
				const response = await axios.post<
					ApiSuccessResponse<{ accessToken: string }>
				>(
					`${BACKEND_URL}/api/auth/refresh-token`,
					{},
					{ withCredentials: true },
				);

				return response.data.data.accessToken;
			} catch (error) {
				throw error;
			} finally {
				refreshPromise = null;
			}
		})();
	}

	return refreshPromise;
}

// Attach Zustand access token to every outgoing request
api.interceptors.request.use(
	function (config) {
		const token = useAuth.getState().accessToken;
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	function (error: AxiosError) {
		if (import.meta.env.DEV) {
			console.log("Request Error: ", {
				message: error.message,
				status: error.response?.status,
				method: error.config?.method,
				url: error.config?.url,
			});
		}
		return Promise.reject(error);
	},
);

// Catch 401 errors and request a new token via refresh endpoint
api.interceptors.response.use(
	function (response) {
		return response;
	},
	async function (error: AxiosError) {
		if (import.meta.env.DEV) {
			console.log("Response Error: ", {
				message: error.message,
				status: error.response?.status,
				method: error.config?.method,
				url: error.config?.url,
			});
		}

		const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

		// Do not attempt refresh on auth endpoints (sign-in, sign-up, refresh-token)
		const isAuthEndpoint =
			originalRequest?.url?.includes("/api/auth/sign-in") ||
			originalRequest?.url?.includes("/api/auth/sign-up") ||
			originalRequest?.url?.includes("/api/auth/refresh-token");

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry &&
			!isAuthEndpoint
		) {
			originalRequest._retry = true;

			try {
				const newAccessToken = await refreshAccessToken();

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
