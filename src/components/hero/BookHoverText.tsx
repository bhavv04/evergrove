"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const FAVORITE_BOOKS = [
	{
		title: "Piranesi",
		cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1773750050i/50202953.jpg"
	},
	{
		title: "Words of Radiance",
		cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1728768241i/17332218.jpg"
	},
	{
		title: "The Brothers Karamazov",
		cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1616243056i/4935._SX300_.jpg"
	},
	{
		title: "The Sword of Destiny",
		cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1537891490i/42054761._SX300_.jpg"
	}
];

export function BookHoverText() {
	const [hovered, setHovered] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [offset, setOffset] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);
	const popoverRef = useRef<HTMLSpanElement>(null);
	const canHover = useRef(false);

	useEffect(() => {
		canHover.current = window.matchMedia("(hover: hover)").matches;
	}, []);

	const open = hovered || pinned;

	useEffect(() => {
		if (!pinned) return;
		const close = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setPinned(false);
		};
		document.addEventListener("pointerdown", close);
		return () => document.removeEventListener("pointerdown", close);
	}, [pinned]);

	// Clamp the popover so it never crosses the viewport edge, which is what
	// was pushing the page's scroll width out on mobile.
	useLayoutEffect(() => {
		if (!open || !ref.current || !popoverRef.current) return;
		const margin = 12;
		const triggerRect = ref.current.getBoundingClientRect();
		const popoverWidth = popoverRef.current.offsetWidth;
		const centerX = triggerRect.left + triggerRect.width / 2;
		const idealLeft = centerX - popoverWidth / 2;
		const maxLeft = window.innerWidth - popoverWidth - margin;
		const clampedLeft = Math.min(Math.max(idealLeft, margin), maxLeft);
		setOffset(clampedLeft - idealLeft);
	}, [open]);

	return (
		<span
			ref={ref}
			className="group relative inline-block cursor-pointer underline decoration-white/50 underline-offset-3 transition-colors duration-300 hover:decoration-white"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => {
				setHovered(false);
				// On real hover devices, leaving should always close it,
				// even if it was pinned open by a click.
				if (canHover.current) setPinned(false);
			}}
			onClick={(e) => {
				e.stopPropagation();
				setPinned((p) => !p);
			}}
		>
			books
			<span
				ref={popoverRef}
				style={{ ["--tw-translate-x" as string]: `calc(-50% + ${offset}px)` }}
				className={`absolute bottom-full left-1/2 z-50 w-64 origin-bottom overflow-hidden rounded-md transition-all duration-200 ease-out md:w-72 ${
					open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-1 scale-90 opacity-0"
				}`}
			>
				<span className="flex">
					{FAVORITE_BOOKS.map((book) => (
						<img
							key={book.title}
							src={book.cover}
							alt={book.title}
							title={book.title}
							loading="lazy"
							className="h-24 w-16 shrink-0 object-cover shadow-md md:h-28 md:w-18"
						/>
					))}
				</span>
			</span>
		</span>
	);
}
