import { Navigate, Outlet, useLocation, type Location } from "react-router";
import { useAuthSession } from "@/hooks/useAuthSession";
import FullScreenLoader from "@/components/custom/FullScreenLoader";

export const GuestRoute = () => {
	const location = useLocation();
	const { accessToken, isRefreshing } = useAuthSession();

	const fromLocation = (location.state as { from?: Location })?.from;
	const from = fromLocation
		? `${fromLocation.pathname}${fromLocation.search || ""}`
		: "/home";

	if (isRefreshing) {
		return <FullScreenLoader />;
	}

	if (accessToken) {
		// Redirect authenticated user away from sign-in/sign-up to target destination or home
		return <Navigate to={from} replace />;
	}

	return <Outlet />;
};
