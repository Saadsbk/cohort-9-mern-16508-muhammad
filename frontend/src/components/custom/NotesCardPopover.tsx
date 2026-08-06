import { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

export interface NotesCardPopoverProps {
	documentId: string;
	title?: string;

	onRename: (documentId: string, newTitle: string) => void | Promise<void>;
	onDelete: (documentId: string) => void | Promise<void>;

	children: React.ReactNode;
}


export default function NotesCardPopover({
	documentId,
	title = "Untitled Note",
	onRename,
	onDelete,
	children,
}: NotesCardPopoverProps) {

	const [isOpen, setIsOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState(title);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setIsEditing(false);
			setNewTitle(title);
		}
	};

	const handleSaveRename = async (e?: React.SyntheticEvent) => {
		if (e) e.preventDefault();
		const trimmed = newTitle.trim();
		if (!trimmed) {
			toast.add({
				title: "Title cannot be empty",
				type: "error",
			});
			return;
		}

		try {
			setIsSubmitting(true);
			await onRename(documentId, trimmed);

			toast.add({
				title: "Note renamed successfully",
				type: "success",
			});

			setIsEditing(false);
			setIsOpen(false);

		} catch (error) {

			toast.add({
				title: "Failed to rename note",
				description: (error as Error)?.message,
				type: "error",
			});
		
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsSubmitting(true);;
			await onDelete(documentId);

			toast.add({
				title: "Note deleted",
				type: "success",
			});

			setIsOpen(false);
		} catch (error) {

			toast.add({
				title: "Failed to delete note",
				description: (error as Error)?.message,
				type: "error",
			});

		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Popover open={isOpen} onOpenChange={handleOpenChange}>
			<PopoverTrigger
				render={children as React.ReactElement}
				onClick={(e) => e.stopPropagation()}
			/>

			<PopoverContent
				align="start"
				side="bottom"
				sideOffset={6}
				className="w-56 p-3 gap-2"
				onClick={(e) => e.stopPropagation()}
			>
				{isEditing ? (
					<form onSubmit={handleSaveRename} className="flex flex-col gap-2">
						<PopoverHeader className="px-1">
							<PopoverTitle className="text-xs font-semibold text-muted-foreground">
								Rename Note
							</PopoverTitle>
						</PopoverHeader>
						<Input
							type="text"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							placeholder="Enter title..."
							autoFocus
							disabled={isSubmitting}
							className="h-8 text-xs bg-muted/50 border-border/60"
						/>
						<div className="flex items-center justify-end gap-1.5 pt-1">
							<Button
								variant="secondary"
								size="sm"
								disabled={isSubmitting}
								onClick={() => {
									setIsEditing(false);
									setNewTitle(title);
								}}
								className="h-7 text-xs px-2"
							>
								<X className="h-3.5 w-3.5 mr-1" />
								Cancel
							</Button>
							<Button
								size="sm"
								disabled={isSubmitting}
								className="h-7 text-xs px-2.5 font-medium"
							>
								{isSubmitting ? (
									<Loader2 className="h-3.5 w-3.5 animate-spin" />
								) : (
									<>
										<Check className="h-3.5 w-3.5 mr-1" />
										Save
									</>
								)}
							</Button>
						</div>
					</form>
				) : (
					<div className="flex flex-col gap-1">
						<Button
							variant="ghost"
							disabled={isSubmitting}
							onClick={() => {
								setNewTitle(title);
								setIsEditing(true);
							}}
							className="flex items-center justify-start gap-2 w-full px-2.5 py-1.5 h-8 text-xs font-medium text-foreground hover:bg-secondary dark:hover:bg-stone-700/90 rounded-xl transition-colors cursor-pointer"
						>
							<Pencil className="h-3.5 w-3.5 text-muted-foreground" />
							Rename Note
						</Button>
						<Button
							variant="ghost"
							disabled={isSubmitting}
							onClick={handleDelete}
							className="flex items-center justify-start gap-2 w-full px-2.5 py-1.5 h-8 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/20 dark:hover:bg-destructive/35 rounded-xl transition-colors cursor-pointer"
						>
							{isSubmitting ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<Trash2 className="h-3.5 w-3.5 text-destructive" />
							)}
							Delete Note
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
