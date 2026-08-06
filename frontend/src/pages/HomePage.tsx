import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import HomePageLayout from "@/components/custom/HomePageLayout";
import NotesCard from "@/components/custom/NotesCard";

interface NoteItem {
	id: string;
	title: string;
}

function generateMockNotes(): NoteItem[] {
	const words: string[] = [
		"react",
		"tailwind",
		"nodejs",
		"zustand",
		"reactquery",
		"react-router",
		"js",
		"hooks",
		"component",
		"schadcn",
	];

	return Array.from({ length: 100 }, () => {
		const id = crypto.randomUUID();
		const title =
			words[Math.floor(Math.random() * words.length)] +
			" " +
			words[Math.floor(Math.random() * words.length)];
		return { id, title };
	});
}

export default function HomePage() {
	const [searchParams] = useSearchParams();
	const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();

	// Local notes state initialized once lazily
	const [notes, setNotes] = useState<NoteItem[]>(generateMockNotes);

	const handleRename = (documentId: string, newTitle: string) => {
		setNotes((prev) =>
			prev.map((n) => (n.id === documentId ? { ...n, title: newTitle } : n)),
		);
	};

	const handleDelete = (documentId: string) => {
		setNotes((prev) => prev.filter((n) => n.id !== documentId));
	};

	// Will be replaced with correct data from backend via react query
	// but for now, we used useMemo to prevent re-render when search input changes
	const filteredNotes = useMemo(() => {
		if (!searchQuery) return notes;
		return notes.filter((note) =>
			note.title.toLowerCase().includes(searchQuery),
		);
	}, [notes, searchQuery]);

	return (
		<HomePageLayout>
			{filteredNotes.length > 0 ? (
				<div className="flex gap-6 flex-wrap">
					{filteredNotes.map((note) => (
						<NotesCard
							key={note.id}
							documentId={note.id}
							title={note.title}
							onRename={handleRename}
							onDelete={handleDelete}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-16 text-muted-foreground">
					No notes found matching "{searchQuery}"
				</div>
			)}
		</HomePageLayout>
	);
};
