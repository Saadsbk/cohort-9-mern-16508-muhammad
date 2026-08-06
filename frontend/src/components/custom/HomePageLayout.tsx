import type { ReactNode } from "react";
import Navbar from "@/components/custom/Navbar";
import { Toaster } from "@/components/ui/toast";

interface HomePageLayoutProps {
	children: ReactNode;
}

export default function HomePageLayout({ children }: HomePageLayoutProps) {
	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
			<Navbar />
			<main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
			<Toaster />
		</div>
	);
}
