import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthSession } from "@/hooks/useAuthSession";

export const ProtectedRoute = () => {
	const location = useLocation();
	const { accessToken, isRefreshing } = useAuthSession();

	if (isRefreshing) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground text-lg font-medium gap-3">
				<Loader2 className="h-6 w-6 animate-spin text-primary" />
				Loading...
			</div>
		);
	}

	if (!accessToken) {
		// Redirect unauthenticated user to sign-in page while saving original location
		return <Navigate to="/sign-in" state={{ from: location }} replace />;
	}

	return <Outlet />;
};
