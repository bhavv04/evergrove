import { Home, User, FolderRoot, Microscope, PencilLine, BriefcaseBusiness } from "lucide-react";
import type { SearchItem } from "@/lib/search/getSearchIndex";

export const TYPE_TO_GROUP: Record<SearchItem["type"], string> = {
	page: "Pages",
	project: "Projects",
	research: "Research",
	post: "Blog"
};

export const TYPE_ICON: Record<SearchItem["type"], React.ElementType> = {
	page: Home,
	project: FolderRoot,
	research: Microscope,
	post: PencilLine
};

export const PAGE_ICON: Record<string, React.ElementType> = {
	home: Home,
	about: User,
	projects: FolderRoot,
	research: Microscope,
	blog: PencilLine
};

export interface PageMeta {
	label: string;
	description: string;
	icon: React.ElementType;
}

export const PAGE_META: { href: string; meta: PageMeta }[] = [
	{ href: "/", meta: { label: "Home", description: "About me and what I'm up to", icon: Home } },
	{
		href: "/about",
		meta: { label: "About", description: "Background, skills, and how I work", icon: User }
	},
	{
		href: "/timeline",
		meta: { label: "Experience & Education", description: "Where I've worked and studied", icon: BriefcaseBusiness }
	},
	{ href: "/projects", meta: { label: "Projects", description: "Things I've built and shipped", icon: FolderRoot } },
	{ href: "/research", meta: { label: "Research", description: "Papers, experiments, and write-ups", icon: Microscope } },
	{ href: "/blog", meta: { label: "Blog", description: "Notes and longer-form writing", icon: PencilLine } }
];

export function getCurrentPageMeta(pathname: string): PageMeta | null {
	if (pathname === "/") return PAGE_META[0].meta;
	const match = PAGE_META.filter((p) => p.href !== "/").find((p) => pathname.startsWith(p.href));
	return match?.meta ?? null;
}
