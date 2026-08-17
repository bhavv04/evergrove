export interface ReadEntry {
	title: string;
	author: string;
	finishedAt: string;
	coverUrl?: string;
	rating?: number;
}

export const recentReads: ReadEntry[] = [
	{
		title: "The Count of Monte Cristo",
		author: "Alexandre Dumas",
		finishedAt: "2026-08-14",
		coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1724863997i/7126.jpg",
		rating: 5
	},
	{
		title: "The Shadow of the Gods",
		author: "John Gwynne",
		finishedAt: "2026-08-08",
		coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1610375894i/52694527.jpg",
		rating: 4
	},
	{
		title: "The Strength of the Few",
		author: "James Islington",
		finishedAt: "2026-07-28",
		coverUrl: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1742965949i/169485073.jpg",
		rating: 5
	}
];
