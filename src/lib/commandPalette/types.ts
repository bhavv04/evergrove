import type { SearchItem } from "@/lib/search/getSearchIndex";

export interface PaletteCommand {
	id: string;
	label: string;
	description?: string;
	group: string;
	icon: React.ElementType;
	hint?: string;
	status?: SearchItem["status"];
	perform: () => void;
	keepOpen?: boolean;
}

export const GROUP_ORDER = ["Pages", "Projects", "Research", "Blog", "Actions", "Connect"];
