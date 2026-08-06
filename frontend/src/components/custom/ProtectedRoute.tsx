import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthSession } from "@/hooks/useAuthSession";
import FullScreenLoader from "@/components/custom/FullScreenLoader";

export const ProtectedRoute = () => {
	const location = useLocation();
	const { accessToken, isRefreshing } = useAuthSession();

	if (isRefreshing) {
		return <FullScreenLoader />;
	}

	if (!accessToken) {
		// Redirect unauthenticated user to sign-in page while saving original location
		return <Navigate to="/sign-in" state={{ from: location }} replace />;
	}

	return <Outlet />;
};
