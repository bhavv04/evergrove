// components/search/SearchTrigger.tsx
"use client";

import { Search } from "lucide-react";

export function SearchTrigger() {
	return (
		<button
			onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
			aria-label="Search"
			className="fixed top-6 left-4 z-50 hidden cursor-pointer items-center gap-2 rounded-xl bg-white p-2 text-stone-900 transition-colors duration-300 hover:bg-stone-100 lg:right-4 lg:left-auto lg:flex"
		>
			<Search size={16} />
		</button>
	);
}
