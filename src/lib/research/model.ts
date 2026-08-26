// model.ts
export type ProjectStatus = "completed" | "in-progress" | "submitted" | "preprint";

export type ResearchTag =
	"finance" | "medicine" | "mathematics" | "climate" | "geospatial" | "physics" | "neuroscience" | "economics" | "artificial-intelligence";

export interface CaseStudy {
	id: string;
	title: string;
	subtitle: string;
	tagline: string;
	abstract: string;
	status: ProjectStatus;
	tags: ResearchTag[];
	year: number;
	methods: string[];
	stack: string[];
	links: {
		repo?: string;
		demo?: string;
		paper?: string;
		SSRN?: string;
	};
	highlights?: string[];
	hasCaseStudy?: boolean;
	slug?: string;
}
