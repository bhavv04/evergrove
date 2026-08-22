"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Project } from "@/app/projects/model";
import { ProjectCard } from "./projectcard";
import { useFlip } from "@/hooks/use-flip";

interface ProjectGridProps {
	projects: Project[];
}

// Tailwind breakpoints: match your sm/lg column counts
function useColumnCount() {
	const [cols, setCols] = useState(1);

	useEffect(() => {
		const compute = () => {
			if (window.innerWidth >= 1024)
				setCols(3); // lg
			else if (window.innerWidth >= 640)
				setCols(2); // sm
			else setCols(1);
		};
		compute();
		window.addEventListener("resize", compute);
		return () => window.removeEventListener("resize", compute);
	}, []);

	return cols;
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

	const columnCount = useColumnCount();

	// round-robin distribute so rank order reads left-to-right across the top row
	const columns = useMemo(() => {
		const cols: { project: Project; originalIndex: number }[][] = Array.from({ length: columnCount }, () => []);
		ordered.forEach((project, i) => {
			cols[i % columnCount].push({ project, originalIndex: i });
		});
		return cols;
	}, [ordered, columnCount]);

	if (ordered.length === 0) {
		return <p className="scale-in mt-16 text-center text-sm">no projects match this filter</p>;
	}

	const isInitialLoad = seenIds.current.size === 0;

	return (
		<div key={visitId.current} ref={containerRef} className="mx-auto grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{columns.map((col, colIdx) => (
				<div key={colIdx} className="flex flex-col gap-3">
					{col.map(({ project, originalIndex }) => {
						const alreadySeen = seenIds.current.has(project.id);
						if (!alreadySeen) seenIds.current.add(project.id);

						const animClass = alreadySeen ? "fade-in-up-fast" : isInitialLoad ? "fade-in-up" : "scale-in";

						return (
							<div key={project.id} data-flip-id={project.id}>
								<div className={animClass} style={{ "--delay-index": originalIndex } as React.CSSProperties}>
									<ProjectCard project={project} />
								</div>
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}
