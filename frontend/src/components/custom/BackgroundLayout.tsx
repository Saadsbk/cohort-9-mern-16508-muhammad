import bg from "@/assets/LandingPage-bg.png";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";

interface BackgroundLayoutProps {
	children: ReactNode;
}

export default function BackgroundLayout({ children }: BackgroundLayoutProps) {
	return (
		<div className="relative flex justify-center items-center min-h-screen overflow-hidden px-6 gap-9 flex-col">
			<img
				src={bg}
				className="absolute inset-0 h-full w-full object-cover object-[0%_14%]"
				alt="Notebook on a table in dim lighting"
			/>
			<div className="pointer-events-none absolute inset-0 z-0 bg-black/35" />
			<div className="relative z-10 flex w-full justify-center">
				{children}
			</div>
			<Toaster />
		</div>
	);
}
