import { Link, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import UserAccountNav from "@/components/custom/UserAccountNav";

export default function Navbar() {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchQuery = searchParams.get("search") || "";

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		if (val) {
			setSearchParams({ search: val });
		} else {
			setSearchParams({});
		}
	};

	return (
		<header className="w-full px-2 py-3 bg-secondary">
			<div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">

				<Link to="/" className="flex items-center gap-3 group shrink-0">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border group-hover:border-primary group-hover:scale-105 transition-all shadow-xs">
						<img
							src="/favicon.svg"
							alt="Notely Logo"
							className="h-6 w-6 object-contain"
						/>
					</div>
					<span className="hidden sm:block text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors font-serif">
						Notely
					</span>
				</Link>

				<div className="flex-1 max-w-2xl mx-2 sm:mx-6">
					<div className="relative flex items-center w-full">
						<Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
						<input
							type="text"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="Search notes..."
							className="w-full rounded-full bg-muted/60 hover:bg-muted focus:bg-background border border-border focus:border-primary text-foreground placeholder:text-muted-foreground text-sm pl-10 pr-4 py-2 outline-hidden focus:ring-1 focus:ring-ring transition-all shadow-inner"
						/>
					</div>
				</div>

				<div className="flex items-center shrink-0">
					<UserAccountNav />
				</div>
			</div>
		</header>
	);
}
