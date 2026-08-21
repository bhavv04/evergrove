"use client";

import { ProjectTag } from "@/app/projects/model";

interface FilterProps {
	tags: ProjectTag[];
	selected: Set<ProjectTag>;
	onChange: (tags: Set<ProjectTag>) => void;
}

export function Filter({ tags, selected, onChange }: FilterProps) {
	const toggle = (tag: ProjectTag) => {
		const next = new Set(selected);
		if (next.has(tag)) next.delete(tag);
		else next.add(tag);
		onChange(next);
	};

	return (
		<div className="mb-4 flex flex-wrap gap-2">
			{tags.map((tag, i) => {
				const active = selected.has(tag);
				return (
					<button
						key={tag}
						onClick={() => toggle(tag)}
						className={`fade-in-up-fast relative inline-flex items-center justify-center rounded-md px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300 ease-in-out ${
							active ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-white hover:text-black"
						}`}
						style={{ "--delay-index": i } as React.CSSProperties}
					>
						{tag}
					</button>
				);
			})}

			{selected.size > 0 && (
				<button
					onClick={() => onChange(new Set())}
					className="group relative inline-flex items-center gap-1.5 rounded-md px-2 text-xs text-white/80 transition-all duration-300 ease-in-out hover:text-white"
				>
					<span>Clear all</span>
				</button>
			)}
		</div>
	);
}
