"use client";

import { CornerDownLeft } from "lucide-react";
import type { PaletteCommand } from "@/lib/commandPalette/types";

interface Props {
	grouped: { order: { group: string; items: PaletteCommand[] }[]; flat: PaletteCommand[] };
	query: string;
	selected: number;
	setSelected: (i: number) => void;
	runCommand: (cmd: PaletteCommand | undefined) => void;
	itemRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

export function CommandPaletteList({ grouped, query, selected, setSelected, runCommand, itemRefs }: Props) {
	let runningIndex = -1;

	return (
		<div className="cmdk-scroll flex-1 overflow-y-auto p-1.5">
			{grouped.flat.length === 0 && <div className="py-6 text-center text-sm text-white/40">No results for &ldquo;{query}&rdquo;</div>}

			{grouped.order.map(({ group, items: groupItems }) => {
				groupItems.forEach((cmd) => {
					if (!cmd.icon) console.warn("Missing icon for command:", cmd.id, cmd.label);
				});

				return (
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
									className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
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
				);
			})}
		</div>
	);
}
