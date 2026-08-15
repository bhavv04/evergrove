"use client";

import React, { useState } from "react";
import { ProjectTag } from "./model";
import { projects } from "./data";
import { SectionTitle } from "@/components/typography/SectionTitle";
import { Filter } from "@/app/projects/components/filter";
import { ProjectGrid } from "@/app/projects/components/projectgrid";
import { BsTools } from "react-icons/bs";

const allTags = [...new Set(projects.flatMap((p) => p.tags))] as ProjectTag[];

// eslint-disable-next-line react-refresh/only-export-components
export default function ProjectView() {
	const [selected, setSelected] = useState<Set<ProjectTag>>(new Set());

	const filtered = (selected.size > 0 ? projects.filter((p) => p.tags.some((tag) => selected.has(tag))) : projects).sort(
		(a, b) => Number(b.featured) - Number(a.featured)
	);

	return (
		<div className="pb-24">
			<div className="">
				<div className="mb-4">
					<SectionTitle
						text={
							<span className="fade-in-up flex items-center gap-2" style={{ "--delay-index": 0 } as React.CSSProperties}>
								<BsTools />
								<span>Workshop</span>
							</span>
						}
					/>

					<p className="fade-in-up mt-2" style={{ "--delay-index": 1 } as React.CSSProperties}>
						here are some of my featured projects and repositories I&apos;ve been currently working on.
					</p>
				</div>

				<Filter tags={allTags} selected={selected} onChange={setSelected} />
				<ProjectGrid projects={filtered} />
			</div>
		</div>
	);
}
