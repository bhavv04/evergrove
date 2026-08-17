"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, FileText, Play, Pause } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa6";
import type { SearchItem } from "@/lib/search/getSearchIndex";
import { PaletteCommand, GROUP_ORDER } from "@/lib/commandPalette/types";
import { TYPE_TO_GROUP, TYPE_ICON, PAGE_ICON } from "@/lib/commandPalette/pageMeta";

export function useCommandPaletteCommands(items: SearchItem[], query: string, showToast: (msg: string) => void) {
	const router = useRouter();
	const [isPlaying, setIsPlaying] = useState(false);

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

	// mirrors playback state from useAudioPlayer
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
				icon: FiGithub,
				perform: () => go("https://github.com/bhavv04")
			},
			{
				id: "linkedin",
				label: "LinkedIn",
				group: "Connect",
				icon: FaLinkedinIn,
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

	return { grouped };
}
