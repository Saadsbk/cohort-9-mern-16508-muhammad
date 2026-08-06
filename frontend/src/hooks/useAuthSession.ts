import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/store/auth";
import api from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/types";

/**
 * Custom hook that returns current accessToken and handles silent session restoration
 * via the refresh token API endpoint.
 */
export function useAuthSession() {
	const accessToken = useAuth((state) => state.accessToken);
	const setAccessToken = useAuth((state) => state.actions.setAccessToken);
	const logout = useAuth((state) => state.actions.logout);

	const { isLoading: isRefreshing } = useQuery({
		
		queryKey: ["refreshToken"],

		queryFn: async () => {
			try {
				const res = await api.post<ApiSuccessResponse<{ accessToken: string }>>("/api/auth/refresh-token");
				if (res.data?.success && res.data?.data?.accessToken) {
					setAccessToken(res.data.data.accessToken);
				}
				return res.data;
			} catch (err) {
				if (axios.isAxiosError(err) && err.response?.status === 401) {
					logout();
				}
				throw err;
			}
		},
		enabled: !accessToken, // Only attempt refresh if access token is missing from memory
		retry: false,           // Do not retry on failure
		staleTime: Infinity,    // Deduplicate in-flight requests
	});

	return {
		accessToken,
		isRefreshing: !accessToken && isRefreshing,
	};
}
