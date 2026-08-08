"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
	Home,
	User,
	FolderRoot,
	Microscope,
	PencilLine,
	Mail,
	Github,
	Linkedin,
	FileText,
	BriefcaseBusiness,
	Play,
	Pause,
	CornerDownLeft,
	ArrowUp,
	ArrowDown,
	Search
} from "lucide-react";
import type { SearchItem } from "@/lib/search/getSearchIndex";

interface PaletteCommand {
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
const GROUP_ORDER = ["Pages", "Projects", "Research", "Blog", "Actions", "Connect"];

const TYPE_TO_GROUP: Record<SearchItem["type"], string> = {
	page: "Pages",
	project: "Projects",
	research: "Research",
	post: "Blog"
};

const TYPE_ICON: Record<SearchItem["type"], React.ElementType> = {
	page: Home,
	project: FolderRoot,
	research: Microscope,
	post: PencilLine
};

const PAGE_ICON: Record<string, React.ElementType> = {
	home: Home,
	about: User,
	projects: FolderRoot,
	research: Microscope,
	blog: PencilLine
};

interface PageMeta {
	label: string;
	description: string;
	icon: React.ElementType;
}

const PAGE_META: { href: string; meta: PageMeta }[] = [
	{ href: "/", meta: { label: "Home", description: "About me and what I'm up to", icon: Home } },
	{ href: "/about", meta: { label: "About", description: "Background, skills, and how I work", icon: User } },
	{
		href: "/timeline",
		meta: { label: "Experience & Education", description: "Where I've worked and studied", icon: BriefcaseBusiness }
	},
	{ href: "/projects", meta: { label: "Projects", description: "Things I've built and shipped", icon: FolderRoot } },
	{ href: "/research", meta: { label: "Research", description: "Papers, experiments, and write-ups", icon: Microscope } },
	{ href: "/blog", meta: { label: "Blog", description: "Notes and longer-form writing", icon: PencilLine } }
];

function getCurrentPageMeta(pathname: string): PageMeta | null {
	if (pathname === "/") return PAGE_META[0].meta;
	const match = PAGE_META.filter((p) => p.href !== "/").find((p) => pathname.startsWith(p.href));
	return match?.meta ?? null;
}

export function CommandPalette({ items }: { items: SearchItem[] }) {
	const router = useRouter();
	const pathname = usePathname();
	const currentPage = useMemo(() => getCurrentPageMeta(pathname), [pathname]);
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const [toast, setToast] = useState<string | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const showToast = useCallback((message: string) => {
		setToast(message);
		if (toastTimer.current) clearTimeout(toastTimer.current);
		toastTimer.current = setTimeout(() => setToast(null), 2200);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		setQuery("");
	}, []);

	const go = useCallback(
		(url: string) => {
			if (url.startsWith("http") || url.startsWith("mailto")) {
				window.open(url, url.startsWith("http") ? "_blank" : "_self");
			} else {
				router.push(url);
			}
		},
		[router]
	);

	const copy = useCallback(
		async (text: string, message: string) => {
			try {
				await navigator.clipboard.writeText(text);
				showToast(message);
			} catch {
				showToast("Couldn't copy — try again");
			}
		},
		[showToast]
	);

	// mirrors playback state from useAudioPlayer (see wiring note below)
	useEffect(() => {
		const onState = (e: Event) => setIsPlaying((e as CustomEvent<boolean>).detail);
		document.addEventListener("music:state", onState as EventListener);
		return () => document.removeEventListener("music:state", onState as EventListener);
	}, []);

	const commands = useMemo<PaletteCommand[]>(() => {
		const contentCommands: PaletteCommand[] = items.map((item) => {
			const Icon = item.type === "page" && item.icon && PAGE_ICON[item.icon] ? PAGE_ICON[item.icon] : TYPE_ICON[item.type];
			return {
				id: item.id,
				label: item.title,
				description: item.description,
				group: TYPE_TO_GROUP[item.type],
				icon: Icon,
				status: item.status,
				perform: () => go(item.url)
			};
		});

		const actionCommands: PaletteCommand[] = [
			{
				id: "toggle-music",
				label: isPlaying ? "Pause Music" : "Play Music",
				group: "Actions",
				icon: isPlaying ? Pause : Play,
				perform: () => document.dispatchEvent(new CustomEvent("music:toggle"))
			},
			{
				id: "copy-email",
				label: "Copy Email",
				group: "Actions",
				icon: Mail,
				hint: "bhavdeepsa@gmail.com",
				keepOpen: true,
				perform: () => copy("bhavdeepsa@gmail.com", "Email copied to clipboard")
			},
			{
				id: "github",
				label: "GitHub",
				group: "Connect",
				icon: Github,
				perform: () => go("https://github.com/bhavv04")
			},
			{
				id: "linkedin",
				label: "LinkedIn",
				group: "Connect",
				icon: Linkedin,
				perform: () => go("https://linkedin.com/in/bhavdeeparora")
			},
			{
				id: "resume",
				label: "Resume",
				group: "Connect",
				icon: FileText,
				perform: () => go("/Bhavdeep_s_Resume.pdf")
			}
		];

		return [...contentCommands, ...actionCommands];
	}, [items, isPlaying, go, copy]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return commands;
		const tokens = q.split(/\s+/);
		return commands.filter((c) => {
			const haystack = `${c.label} ${c.group} ${c.description ?? ""} ${c.hint ?? ""}`.toLowerCase();
			return tokens.every((t) => haystack.includes(t));
		});
	}, [query, commands]);

	const grouped = useMemo(() => {
		const map = new Map<string, PaletteCommand[]>();
		for (const c of filtered) {
			if (!map.has(c.group)) map.set(c.group, []);
			map.get(c.group)!.push(c);
		}
		const flat: PaletteCommand[] = [];
		const order: { group: string; items: PaletteCommand[] }[] = [];
		for (const g of GROUP_ORDER) {
			const groupItems = map.get(g);
			if (groupItems?.length) {
				order.push({ group: g, items: groupItems });
				flat.push(...groupItems);
			}
		}
		return { order, flat };
	}, [filtered]);

	const runCommand = useCallback(
		(cmd: PaletteCommand | undefined) => {
			if (!cmd) return;
			cmd.perform();
			if (!cmd.keepOpen) close();
		},
		[close]
	);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setIsOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		setSelected(0);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const t = setTimeout(() => inputRef.current?.focus(), 40);
		return () => {
			document.body.style.overflow = prevOverflow;
			clearTimeout(t);
		};
	}, [isOpen]);

	useEffect(() => setSelected(0), [query]);

	useEffect(() => {
		itemRefs.current[selected]?.scrollIntoView({ block: "nearest" });
	}, [selected]);

	const onListKeyDown = (e: React.KeyboardEvent) => {
		const total = grouped.flat.length;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelected((s) => (s + 1) % Math.max(total, 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelected((s) => (s - 1 + total) % Math.max(total, 1));
		} else if (e.key === "Enter") {
			e.preventDefault();
			runCommand(grouped.flat[selected]);
		} else if (e.key === "Escape") {
			e.preventDefault();
			close();
		}
	};

	let runningIndex = -1;

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[20vh] backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						onMouseDown={close}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.96, y: -8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.97, y: -6 }}
							transition={{ type: "spring", stiffness: 460, damping: 34 }}
							onMouseDown={(e) => e.stopPropagation()}
							onKeyDown={onListKeyDown}
							className="flex max-h-[55vh] w-full max-w-xs flex-col overflow-hidden rounded-xl bg-stone-900/80 shadow-2xl shadow-black/50 backdrop-blur-2xl backdrop-saturate-150 sm:max-w-md"
						>
							{currentPage && (
								<div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
									<currentPage.icon size={14} className="shrink-0 text-white/40" />
									<div className="min-w-0 flex-1 leading-tight">
										<p className="truncate text-xs font-medium text-white">{currentPage.label}</p>
										<p className="truncate text-2xs text-white/40">{currentPage.description}</p>
									</div>
								</div>
							)}

							<div className="flex items-center gap-2 border-b border-white/10 px-3">
								<Search size={14} className="shrink-0 text-white/40" />
								<input
									ref={inputRef}
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder="Type a command or search…"
									spellCheck={false}
									autoComplete="off"
									className="w-full bg-transparent py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
								/>
								<kbd className="shrink-0 rounded border border-white/15 px-1.5 py-0.5 text-2xs text-white/40">esc</kbd>
							</div>

							<div className="cmdk-scroll flex-1 overflow-y-auto p-1.5">
								{grouped.flat.length === 0 && (
									<div className="py-6 text-center text-sm text-white/40">No results for &ldquo;{query}&rdquo;</div>
								)}

								{grouped.order.map(({ group, items: groupItems }) => (
									<div key={group}>
										<div className="px-2.5 pt-2 pb-1 text-2xs font-medium tracking-wide text-white/30 uppercase">{group}</div>
										{groupItems.map((cmd) => {
											runningIndex += 1;
											const idx = runningIndex;
											const isSelected = idx === selected;
											return (
												<button
													key={cmd.id}
													ref={(el) => {
														itemRefs.current[idx] = el;
													}}
													onMouseMove={() => setSelected(idx)}
													onClick={() => runCommand(cmd)}
													className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
														isSelected ? "bg-white/10 text-white" : "text-white/80"
													}`}
												>
													<cmd.icon size={14} className={`shrink-0 ${isSelected ? "text-white" : "text-white/40"}`} />
													<div className="min-w-0 flex-1 leading-tight">
														<p className="truncate font-medium">{cmd.label}</p>
														{cmd.description && <p className="truncate text-xs text-white/40">{cmd.description}</p>}
													</div>
													{cmd.status && (
														<span className="shrink-0 rounded border border-white/15 px-1.5 py-0.5 text-2xs font-medium text-white/50">
															{cmd.status === "live" ? "Live" : "Building"}
														</span>
													)}
													{cmd.hint && <span className="shrink-0 rounded px-1 py-0.5 text-xs text-white/40">{cmd.hint}</span>}
													{isSelected && <CornerDownLeft size={12} className="shrink-0 text-white/30" />}
												</button>
											);
										})}
									</div>
								))}
							</div>

							<div className="flex items-center gap-3 border-t border-white/10 px-3 py-2 text-2xs text-white/35">
								<span className="flex items-center gap-1">
									<ArrowUp size={11} />
									<ArrowDown size={11} /> navigate
								</span>
								<span className="flex items-center gap-1">
									<CornerDownLeft size={11} /> select
								</span>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{toast && (
					<motion.div
						initial={{ opacity: 0, y: 16, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 16, scale: 0.95 }}
						transition={{ type: "spring", stiffness: 400, damping: 28 }}
						className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-xl border border-white/10 bg-stone-900 px-4 py-2.5 text-sm text-white shadow-2xl"
					>
						{toast}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
