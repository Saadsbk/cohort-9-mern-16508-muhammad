import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { FileText, Plus, EllipsisVertical } from "lucide-react";
import NotesCardPopover from "@/components/custom/NotesCardPopover";

export interface NotesCardProps {
	documentId?: string;
	title?: string;
	onRename: (documentId: string, newTitle: string) => void | Promise<void>;
	onDelete: (documentId: string) => void | Promise<void>;
}

export default function NotesCard({
	documentId = "",
	title,
	onRename,
	onDelete,
}: NotesCardProps) {
	const navigate = useNavigate();

	return (
		<div className="relative w-32 h-48 group">
			<Button
				className="w-full h-full bg-accent-foreground/15 hover:bg-accent-foreground/25 rounded-2xl shadow-2xl hover:ring-2 hover:ring-ring/50 transition-all cursor-pointer flex flex-col justify-between p-0 overflow-hidden border border-border/30"
				onClick={() => navigate(`/document/${documentId || "new"}`)}
			>
				<div className="flex-1 flex flex-col items-center justify-center w-full">
					{documentId ? (
						<FileText className="size-10 mt-auto text-muted-foreground/70 group-hover:scale-110 transition-transform" />
					) : (
						<Plus className="size-10 mt-auto text-muted-foreground group-hover:scale-110 transition-transform" />
					)}
					{documentId && (
						<div className="mt-auto w-full bg-background/80 dark:bg-card/80 backdrop-blur-xs px-3 py-2 border-t border-border/40 flex items-center justify-between gap-1 rounded-b-2xl">
							<p className="text-xs font-medium text-foreground truncate flex-1 text-left">
								{title || "Untitled Note"}
							</p>
							<div className="w-6 h-6 shrink-0" />
						</div>
					)}
				</div>
			</Button>
			{documentId && (
				<div className="absolute bottom-1.5 right-2 z-10">
					<NotesCardPopover
						documentId={documentId}
						title={title}
						onRename={onRename}
						onDelete={onDelete}
					>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 p-0 group-hover:scale-110 transition-transform cursor-pointer"
						>
							<EllipsisVertical className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
						</Button>
					</NotesCardPopover>
				</div>
			)}
		</div>
	);
}
