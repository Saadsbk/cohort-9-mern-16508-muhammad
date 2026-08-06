import { Loader2 } from "lucide-react";

export interface FullScreenLoaderProps {
	message?: string;
}

export default function FullScreenLoader({ message = "Loading..." }: FullScreenLoaderProps) {
	return (
		<div
			role="status"
			className="flex items-center justify-center min-h-screen bg-background text-foreground text-lg font-medium gap-3"
		>
			<Loader2 className="h-6 w-6 animate-spin text-primary" />
			<span>{message}</span>
		</div>
	);
}
