"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/views/Navbar";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import Oneko from "@/components/ui/oneko";
import { ScrollBackground } from "@/components/graphics/ScrollBackground";
import { CatProvider } from "@/context/CatContext";
import { MusicWidget } from "@/components/widget/music-widget";
import { enforceSingleAudioPlayback } from "@/lib/audio/mediaExclusivity";
import { CommandPalette } from "@/components/search/CommandPalette";
import type { SearchItem } from "@/lib/search/getSearchIndex";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { CustomCursor } from "@/components/ui/CustomCursor";

interface RootLayoutClientProps {
	children: React.ReactNode;
	searchIndex: SearchItem[];
}

export function RootLayoutClient({ children, searchIndex }: RootLayoutClientProps) {
	useEffect(() => {
		enforceSingleAudioPlayback();
	}, []);

	return (
		<CatProvider>
			<CustomCursor />
			<ScrollBackground />
			<Oneko />
			<ResponsiveContainer>
				<main className="p-8">
					<Navbar />
					<div className="p-4" />
					{children}
					<CommandPalette items={searchIndex} />
				</main>
			</ResponsiveContainer>
			<MusicWidget />
			<SearchTrigger />
			<Analytics />
		</CatProvider>
	);
}
