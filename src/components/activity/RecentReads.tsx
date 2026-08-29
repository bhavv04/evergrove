import { recentReads } from "@/lib/reading/status";
import { BookOpen } from "lucide-react";

function timeAgo(dateStr: string) {
	const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
	if (days === 0) return "today";
	if (days === 1) return "yesterday";
	if (days < 7) return `${days}d ago`;
	return `${Math.floor(days / 7)}w ago`;
}

function Stars({ rating }: { rating: number }) {
	return (
		<div className="flex gap-0.5">
			{Array.from({ length: 5 }).map((_, i) => (
				<span key={i} className={i < rating ? "text-amber-400" : "text-white/15"}>
					★
				</span>
			))}
		</div>
	);
}

export default function RecentReads() {
	const latestReads = [...recentReads].sort((a, b) => new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime()).slice(0, 3);

	return (
		<div className="flex h-full w-full flex-col px-2">
			<h3 className="mb-4 flex items-center gap-1.5 text-sm text-white/70">
				<BookOpen size={16} /> Recent reads
			</h3>

			<div className="flex flex-1 flex-col justify-center gap-2">
				{latestReads.map((book, i) => (
					<div key={i} className="flex items-center gap-3">
						{book.coverUrl ? (
							<img src={book.coverUrl} alt={book.title} className="h-16 w-10 flex-shrink-0 rounded object-cover" />
						) : (
							<div className="h-16 w-16 flex-shrink-0 rounded border border-white/10 bg-white/5" />
						)}

						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-white/80">{book.title}</p>
							<p className="truncate text-2xs text-white/40">{book.author}</p>
							{typeof book.rating === "number" && (
								<div className="mt-1 sm:hidden">
									<Stars rating={book.rating} />
								</div>
							)}
						</div>

						{typeof book.rating === "number" && (
							<div className="hidden shrink-0 sm:block">
								<Stars rating={book.rating} />
							</div>
						)}

						<span className="shrink-0 text-2xs text-white/30">{timeAgo(book.finishedAt)}</span>
					</div>
				))}
			</div>
		</div>
	);
}
