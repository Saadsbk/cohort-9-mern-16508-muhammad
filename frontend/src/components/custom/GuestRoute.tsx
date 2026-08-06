import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthSession } from "@/hooks/useAuthSession";

export const GuestRoute = () => {
	const location = useLocation();
	const { accessToken, isRefreshing } = useAuthSession();

	const fromLocation = (location.state as { from?: Location })?.from;
	const from = fromLocation
		? `${fromLocation.pathname}${fromLocation.search || ""}`
		: "/home";

	if (isRefreshing) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground text-lg font-medium gap-3">
				<Loader2 className="h-6 w-6 animate-spin text-primary" />
				Loading...
			</div>
		);
	}

	if (accessToken) {
		// Redirect authenticated user away from sign-in/sign-up to target destination or home
		return <Navigate to={from} replace />;
	}

	return <Outlet />;
};
