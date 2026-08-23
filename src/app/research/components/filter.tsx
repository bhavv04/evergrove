// research/components/filter.tsx
"use client";

import { useEffect, useState } from "react";
import { ProjectStatus, ResearchTag } from "@/app/research/model";
import { caseStudies } from "@/app/research/data";
import { ResearchGrid } from "./researchgrid";

const ALL_TAGS: ResearchTag[] = [
	"finance",
	"medicine",
	"mathematics",
	"climate",
	"geospatial",
	"physics",
	"neuroscience",
	"economics",
	"artificial-intelligence"
];

const ALL_STATUSES: ProjectStatus[] = ["submitted", "preprint"];

const statusLabel: Record<ProjectStatus, string> = {
	completed: "Completed",
	"in-progress": "In Progress",
	submitted: "Submitted",
	preprint: "Preprint"
};

export default function ResearchFilter() {
	const [selectedTags, setSelectedTags] = useState<Set<ResearchTag>>(new Set());
	const [selectedStatuses, setSelectedStatuses] = useState<Set<ProjectStatus>>(new Set());
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const toggleTag = (tag: ResearchTag) => {
		const next = new Set(selectedTags);
		if (next.has(tag)) next.delete(tag);
		else next.add(tag);
		setSelectedTags(next);
	};

	const toggleStatus = (status: ProjectStatus) => {
		const next = new Set(selectedStatuses);
		if (next.has(status)) next.delete(status);
		else next.add(status);
		setSelectedStatuses(next);
	};

	const clearAll = () => {
		setSelectedTags(new Set());
		setSelectedStatuses(new Set());
	};

	const hasFilters = selectedTags.size > 0 || selectedStatuses.size > 0;

	const usedTags = ALL_TAGS.filter((t) => caseStudies.some((c) => c.tags.includes(t)));
	const usedStatuses = ALL_STATUSES.filter((s) => caseStudies.some((c) => c.status === s));

	const filtered = caseStudies.filter((s) => {
		const tagMatch = selectedTags.size === 0 || s.tags.some((t) => selectedTags.has(t));
		const statusMatch = selectedStatuses.size === 0 || selectedStatuses.has(s.status);
		return tagMatch && statusMatch;
	});

	// If filter changes cause expanded card to disappear, collapse it
	useEffect(() => {
		if (expandedId && !filtered.find((s) => s.id === expandedId)) {
			setExpandedId(null);
		}
	}, [filtered, expandedId]);

	return (
		<div>
			{/* Status filters */}
			<div className="mb-4 flex flex-wrap gap-2">
				{usedStatuses.map((status, i) => {
					const active = selectedStatuses.has(status);
					return (
						<button
							key={status}
							onClick={() => toggleStatus(status)}
							className={`fade-in-up-fast relative inline-flex items-center justify-center rounded-md px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300 ease-in-out ${
								active ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-white hover:text-black"
							}`}
							style={{ "--delay-index": i } as React.CSSProperties}
						>
							{statusLabel[status]}
						</button>
					);
				})}
			</div>

			{/* Tag filters */}
			<div className="mb-4 flex flex-wrap gap-2">
				{usedTags.map((tag, i) => {
					const active = selectedTags.has(tag);
					return (
						<button
							key={tag}
							onClick={() => toggleTag(tag)}
							className={`fade-in-up-fast relative inline-flex items-center justify-center rounded-md px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300 ease-in-out ${
								active ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-white hover:text-black"
							}`}
							style={{ "--delay-index": i } as React.CSSProperties}
						>
							{tag}
						</button>
					);
				})}

				{hasFilters && (
					<button
						onClick={clearAll}
						className="group relative inline-flex items-center gap-1.5 rounded-md px-2 text-xs text-white/80 transition-all duration-300 ease-in-out hover:text-white"
					>
						<span>Clear all</span>
					</button>
				)}
			</div>

			{/* Cards */}
			<ResearchGrid studies={filtered} />
		</div>
	);
}
