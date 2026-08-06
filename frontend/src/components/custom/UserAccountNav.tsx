import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useAuth from "@/store/auth";
import { LogOut, Moon, Settings, Sun, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "@/components/ui/toast";
import { useQueryClient } from '@tanstack/react-query';
import { logoutUser } from "@/api/authApi";

export default function UserAccountNav() {
	const navigate = useNavigate();
	const user = useAuth((state) => state.user);
	const logout = useAuth((state) => state.actions.logout);
	// const logStore = useAuth((state) => state.actions.logStore);
	const queryClient = useQueryClient();

	const [isDark, setIsDark] = useState(() => {
		if (typeof window !== "undefined") {
			return (
				document.documentElement.classList.contains("dark") ||
				localStorage.getItem("theme") === "dark"
			);
		}
		return false;
	});

	useEffect(() => {
		if (isDark) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
		// logStore()
	}, [isDark]);

	const toggleTheme = () => {
		setIsDark((prev) => !prev);
	};

	const handleLogout = async () => {
		try {
			await logoutUser();
		} catch (err) {
			console.log("Server logout error:", err);
		} finally {
			queryClient.removeQueries({ queryKey: ["refreshToken"] });
			toast.add({
				title: "Logged out",
				description: "You have been logged out successfully.",
				type: "info",
			});
			logout();
			navigate("/sign-in");
		}
	};

	const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

	return (
		<Popover>
			<PopoverTrigger>
				<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-xs hover:ring-2 hover:ring-ring/50 transition-all cursor-pointer">
					{initial}
				</div>
			</PopoverTrigger>

			<PopoverContent className="w-64 rounded-2xl bg-popover text-popover-foreground border border-border p-3 shadow-2xl backdrop-blur-xl">
				<div className="flex items-center gap-3 p-2">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-base font-bold">
						{initial}
					</div>
					<div className="flex flex-col truncate">
						<span className="text-sm font-medium text-foreground truncate">
							{user?.username || "User"}
						</span>
						<span className="text-xs text-muted-foreground truncate">
							{user?.email || "user@example.com"}
						</span>
					</div>
				</div>

				<div className="-mb-3 h-1 bg-border" />

				<div className="flex flex-col">
					<button
						type="button"
						onClick={toggleTheme}
						className="flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-left"
					>
						<div className="flex items-center gap-2.5">
							{isDark ? (
								<Sun className="h-4 w-4 text-muted-foreground" />
							) : (
								<Moon className="h-4 w-4 text-muted-foreground" />
							)}
							<span>{isDark ? "Light Mode" : "Dark Mode"}</span>
						</div>
						<span className="text-xs text-muted-foreground font-mono">
							{isDark ? "ON" : "OFF"}
						</span>
					</button>

					<button
						type="button"
						onClick={() => navigate("/deleted-pages")} // Will add in the future
						className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-left"
					>
						<Trash2 className="h-4 w-4 text-muted-foreground" />
						<span>Deleted Pages</span>
					</button>

					<button
						type="button"
						onClick={() => navigate("/settings")} // Will add in the future
						className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-left"
					>
						<Settings className="h-4 w-4 text-muted-foreground" />
						<span>Settings</span>
					</button>

					<div className="my-1 h-1 bg-border" />

					<button
						type="button"
						onClick={handleLogout}
						className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left"
					>
						<LogOut className="h-4 w-4 text-destructive" />
						<span>Logout</span>
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
