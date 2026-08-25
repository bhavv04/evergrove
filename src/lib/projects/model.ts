import React from "react";
import { Technology } from "@/lib/common";

export interface Picture {
	src: string;
	width: number;
	height: number;
}

export interface ProjectScreenshot {
	name: string;
	mobile: Picture;
	desktop: Picture;
}

export interface ProjectDetails {
	name: string;
	summary: string;
	technologies: Technology[];
	logo?: Picture;
	links?: {
		github?: string;
		live?: string;
	};
	hasCaseStudy?: boolean;
	slug?: string;
	screenshots: ProjectScreenshot[];
}

interface BulletedProjectDetails extends ProjectDetails {
	type: "bullets";
	bullets: string[];
}

interface ContentProjectDetails extends ProjectDetails {
	type: "content";
	content: React.ReactNode;
}

export type Project = BulletedProjectDetails | ContentProjectDetails;
