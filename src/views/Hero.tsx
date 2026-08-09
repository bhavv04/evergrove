"use client";
import { HeroBadges } from "@/components/hero/HeroBadges";
import { HeroButtons } from "@/components/hero/HeroButtons";
import { HeroIcons } from "@/components/hero/HeroIcons";
import { CatToggleButton } from "@/components/hero/CatToggle";
import { SectionTitle } from "@/components/typography/SectionTitle";
import { useLiveAge } from "@/components/hero/useLiveAge";
import { BookHoverText } from "@/components/hero/BookHoverText";
import { GameHoverText } from "@/components/hero/GamesHoverText";

export default function HeroSection() {
	const age = useLiveAge();

	return (
		<section id="home" className="mx-auto max-w-160 space-y-4">
			<div className="fade-in-up flex items-center gap-3" style={{ "--delay-index": 0 } as React.CSSProperties}>
				<div className="relative h-12 w-12 shrink-0">
					<img src="/images/ProfilePic.jpeg" alt="Profile" className="h-12 w-12 rounded-full object-cover" />
					<span className="absolute right-1 bottom-2 h-3 w-3">🧸</span>
				</div>
				<SectionTitle className="mt-3" text="Hi, I'm Bhavdeep Arora" />
			</div>

			<div className="fade-in-up" style={{ "--delay-index": 2 } as React.CSSProperties}>
				<HeroIcons />
			</div>

			<div className="fade-in-up" style={{ "--delay-index": 3 } as React.CSSProperties}>
				<p>
					I&apos;m a{" "}
					<span className="text-stone-400 tabular-nums" suppressHydrationWarning>
						{age} y/o
					</span>{" "}
					systems focused software engineer based in Toronto. I&apos;ve been programming for over six years, always chasing whatever problem catches
					my interest.
				</p>
			</div>

			<div className="fade-in-up" style={{ "--delay-index": 4 } as React.CSSProperties}>
				<p>
					My interests span low-level systems, security tooling, applied ML, and distributed systems, with a quiet passion for environmental
					engineering. Distributed systems and machine learning is where most of my curiosity lives. <CatToggleButton />
				</p>
			</div>

			<div className="fade-in-up" style={{ "--delay-index": 5 } as React.CSSProperties}>
				<p>
					Outside of programming, I love learning new things, reading <BookHoverText />, playing <GameHoverText />, and exploring outside! Here&apos;s
					what I&apos;m currently up to:
				</p>
			</div>

			<div className="fade-in-up" style={{ "--delay-index": 5 } as React.CSSProperties}></div>

			<div className="fade-in-up" style={{ "--delay-index": 6 } as React.CSSProperties}>
				<HeroBadges />
			</div>

			<div className="fade-in-up" style={{ "--delay-index": 7 } as React.CSSProperties}>
				<HeroButtons />
			</div>
		</section>
	);
}
