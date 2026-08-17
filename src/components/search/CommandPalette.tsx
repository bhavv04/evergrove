"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, CornerDownLeft, Search } from "lucide-react";
import type { SearchItem } from "@/lib/search/getSearchIndex";
import { getCurrentPageMeta } from "@/lib/commandPalette/pageMeta";
import type { PaletteCommand } from "@/lib/commandPalette/types";
import { useCommandPaletteCommands } from "@/hooks/useCommandPaletteCommands";
import { CommandPaletteList } from "@/components/search/CommandPaletteList";
import { CommandPaletteToast } from "@/components/search/CommandPaletteToast";

export function CommandPalette({ items }: { items: SearchItem[] }) {
	const pathname = usePathname();
	const currentPage = useMemo(() => getCurrentPageMeta(pathname), [pathname]);
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const [toast, setToast] = useState<string | null>(null);

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

	const { grouped } = useCommandPaletteCommands(items, query, showToast);

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
							className="flex max-h-110 w-full max-w-md flex-col overflow-hidden rounded-xl bg-stone-900"
						>
							{currentPage && (
								<div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
									<currentPage.icon size={24} className="shrink-0 text-white/40" />
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

							<CommandPaletteList
								grouped={grouped}
								query={query}
								selected={selected}
								setSelected={setSelected}
								runCommand={runCommand}
								itemRefs={itemRefs}
							/>

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

			<CommandPaletteToast toast={toast} />
		</>
	);
}
