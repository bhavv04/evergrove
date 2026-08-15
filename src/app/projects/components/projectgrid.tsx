"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { Project } from "@/app/projects/model";
import { ProjectCard } from "./projectcard";
import { useFlip } from "@/components/hooks/use-flip";

interface ProjectGridProps {
	projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
	const ordered = [...projects].sort((a, b) => a.rank - b.rank);
	const containerRef = useRef<HTMLDivElement>(null);
	const seenIds = useRef<Set<string>>(new Set());

	const pathname = usePathname();
	const prevPathname = useRef(pathname);
	const visitId = useRef(0);

	if (prevPathname.current !== pathname) {
		prevPathname.current = pathname;
		visitId.current += 1;
		seenIds.current = new Set();
	}

	useFlip(containerRef, [ordered.map((p) => p.id).join(",")]);

	if (ordered.length === 0) {
		return <p className="scale-in mt-16 text-center text-sm">no projects match this filter</p>;
	}

	const isInitialLoad = seenIds.current.size === 0;

	return (
		<div key={visitId.current} ref={containerRef} className="mx-auto grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{ordered.map((project, i) => {
				const alreadySeen = seenIds.current.has(project.id);
				if (!alreadySeen) seenIds.current.add(project.id);

				const animClass = alreadySeen ? "fade-in-up-fast" : isInitialLoad ? "fade-in-up" : "scale-in";

				return (
					<div key={project.id} data-flip-id={project.id}>
						<div className={animClass} style={{ "--delay-index": i } as React.CSSProperties}>
							<ProjectCard project={project} />
						</div>
					</div>
				);
			})}
		</div>
	);
}
