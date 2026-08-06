import { Component, lazy, StrictMode, Suspense, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import LandingPage from "@/pages/LandingPage";
import { GuestRoute } from "@/components/custom/GuestRoute";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";
import FullScreenLoader from "@/components/custom/FullScreenLoader";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center gap-4">
					<h1 className="text-xl font-bold">Something went wrong</h1>
					<p className="text-sm text-muted-foreground">
						An unexpected error occurred while loading this page.
					</p>
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/80 transition-colors cursor-pointer"
					>
						Reload Page
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

const queryClient = new QueryClient();

// eslint-disable-next-line react-refresh/only-export-components
const HomePage = lazy(() => import("@/pages/HomePage"));

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ErrorBoundary>
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
									<Suspense fallback={<FullScreenLoader />}>
										<HomePage />
									</Suspense>
								}
							/>
						</Route>
					</Routes>
				</BrowserRouter>
			</ErrorBoundary>
		</QueryClientProvider>
	</StrictMode>,
);
