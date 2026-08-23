// components/researchgrid.tsx
"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { CaseStudy } from "@/app/research/model";
import ResearchCard from "@/app/research/components/researchcard";
import { useFlip } from "@/hooks/use-flip";

interface ResearchGridProps {
	studies: CaseStudy[];
}

// mirrors the lg:grid-cols-2 breakpoint below
function useColumnCount() {
	const [cols, setCols] = useState(1);

	useEffect(() => {
		const compute = () => {
			setCols(window.innerWidth >= 1024 ? 2 : 1); // lg
		};
		compute();
		window.addEventListener("resize", compute);
		return () => window.removeEventListener("resize", compute);
	}, []);

	return cols;
}

export function ResearchGrid({ studies }: ResearchGridProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const seenIds = useRef<Set<string>>(new Set());

	useFlip(containerRef, [studies.map((s) => s.id).join(",")]);

	const columnCount = useColumnCount();

	// round-robin distribute so read order stays left-to-right across the top row
	const columns = useMemo(() => {
		const cols: { study: CaseStudy; originalIndex: number }[][] = Array.from({ length: columnCount }, () => []);
		studies.forEach((study, i) => {
			cols[i % columnCount].push({ study, originalIndex: i });
		});
		return cols;
	}, [studies, columnCount]);

	if (studies.length === 0) {
		return <p className="scale-in mt-16 text-center text-sm">no projects match the selected filters.</p>;
	}

	return (
		<div ref={containerRef} className="mx-auto grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
			{columns.map((col, colIdx) => (
				<div key={colIdx} className="flex flex-col gap-3">
					{col.map(({ study, originalIndex }) => {
						const alreadySeen = seenIds.current.has(study.id);
						if (!alreadySeen) seenIds.current.add(study.id);

						return (
							<div key={study.id} data-flip-id={study.id}>
								<div className={alreadySeen ? "fade-in-up-fast" : "scale-in"} style={{ "--delay-index": originalIndex } as React.CSSProperties}>
									<ResearchCard study={study} />
								</div>
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}
