"use client";

import { useCat } from "@/context/CatContext";

export function CatToggleButton() {
	const { showCat, toggleCat } = useCat();

	return (
		<button
			onClick={toggleCat}
			className="ms-center relative inline-flex justify-center rounded-md bg-zinc-800 px-2 py-0.5 text-sm transition-colors hover:bg-zinc-700"
		>
			{showCat ? "🙀 hide Cat" : "😺 show Cat"}
		</button>
	);
}
