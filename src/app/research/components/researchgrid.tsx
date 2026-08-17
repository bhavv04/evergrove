// components/researchgrid.tsx
"use client";

import { useRef } from "react";
import { CaseStudy } from "@/app/research/model";
import ResearchCard from "@/app/research/components/researchcard";
import { useFlip } from "@/hooks/use-flip";

interface ResearchGridProps {
	studies: CaseStudy[];
}

export function ResearchGrid({ studies }: ResearchGridProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const seenIds = useRef<Set<string>>(new Set());

	useFlip(containerRef, [studies.map((s) => s.id).join(",")]);

	if (studies.length === 0) {
		return <p className="scale-in text-sm text-white">no projects match the selected filters.</p>;
	}

	return (
		<div ref={containerRef} className="grid grid-cols-1 gap-3 lg:grid-cols-2">
			{studies.map((study, i) => {
				const alreadySeen = seenIds.current.has(study.id);
				if (!alreadySeen) seenIds.current.add(study.id);

				return (
					<div key={study.id} data-flip-id={study.id}>
						<div className={alreadySeen ? "fade-in-up-fast" : "scale-in"} style={{ "--delay-index": i } as React.CSSProperties}>
							<ResearchCard study={study} />
						</div>
					</div>
				);
			})}
		</div>
	);
}
