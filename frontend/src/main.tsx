import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import { Loader2 } from "lucide-react";
import LandingPage from "@/pages/LandingPage";
import { GuestRoute } from "@/components/custom/GuestRoute";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";

const queryClient = new QueryClient();

// eslint-disable-next-line react-refresh/only-export-components
const HomePage = lazy(() => import("@/pages/HomePage"));

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route index element={<LandingPage />} />

					{/* Guest-Only Routes i.e. not logged in users can access */}
					<Route element={<GuestRoute />}>
						<Route path="/sign-in" element={<SignInPage />} />
						<Route path="/sign-up" element={<SignUpPage />} />
					</Route>

					{/* Protected Routes i.e. logged in users can access */}
					<Route element={<ProtectedRoute />}>
						<Route
							path="/home"
							element={
								<Suspense fallback={
									<div className="flex items-center justify-center min-h-screen bg-background text-foreground text-lg font-medium gap-3">
										<Loader2 className="h-6 w-6 animate-spin text-primary" />
										Loading...
									</div>
								}>
									<HomePage />
								</Suspense>
							}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>,
);
