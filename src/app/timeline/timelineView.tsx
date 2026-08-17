"use client";

import { useEffect, useRef } from "react";
import { education, experience } from "./data";
import { SectionTitle } from "@/components/typography/SectionTitle";
import { TbBriefcaseFilled } from "react-icons/tb";

// eslint-disable-next-line react-refresh/only-export-components
export default function TimelineView() {
	const lineRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = lineRef.current;
		if (!el) return;

		el.style.height = "0px";
		el.style.transition = "height 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

		requestAnimationFrame(() => {
			el.style.height = "calc(100% - 1rem)";
		});
	}, []);

	return (
		<main className="md:px min-h-screen px-4 pb-12 sm:px-8 md:pb-0 lg:px-32">
			<div className="mx-auto max-w-4xl">
				{/* Header */}
				<div className="mb-8">
					<SectionTitle
						text={
							<span className="fade-in-up flex items-center gap-2">
								<TbBriefcaseFilled />
								<span>Journey</span>
							</span>
						}
					/>
					<p className="fade-in-up mt-2 text-sm sm:text-base">
						the things i&apos;ve done, the places i&apos;ve been, and the people i&apos;ve worked with along the way.
					</p>
				</div>

				{/*  Timeline  */}
				<div className="relative">
					{/* Animated vertical line */}
					<div ref={lineRef} className="absolute top-2 left-[5.5px] w-px bg-olive-400" style={{ height: 0 }} />

					{/* End dot */}
					<span className="absolute bottom-0 left-[2px] h-2 w-2 rounded-xl bg-olive-500" />

					{/*  Education  */}
					{education.map((ed, i) => (
						<TimelineItem key={ed.school} title={ed.school} subtitle={ed.degree} meta={ed.period} index={i}>
							<p className="mt-1 text-sm opacity-50">{ed.concentration}</p>
							<div className="mt-3 flex flex-wrap gap-2">
								{ed.courses.map((c) => (
									<span key={c} className="rounded-md bg-stone-300/10 px-2 py-0.5 text-xs text-white/60">
										{c}
									</span>
								))}
							</div>
						</TimelineItem>
					))}

					{/*  Divider  */}
					<div className="relative py-6 pl-10">
						<span className="fade-in-up text-sm tracking-wider text-white/40" style={{ "--delay-index": 4 } as React.CSSProperties}>
							{/*  work  */}
						</span>
					</div>

					{/*  Experience  */}
					{experience.map((exp, i) => (
						<TimelineItem key={`${exp.org}-${exp.period}`} title={exp.org} subtitle={exp.role} meta={exp.period} index={education.length + i}>
							<ul className="mt-3 space-y-2">
								{exp.bullets.map((b, j) => (
									<li key={j} className="text-sm opacity-80">
										{b}
									</li>
								))}
							</ul>
						</TimelineItem>
					))}
				</div>
			</div>
		</main>
	);
}

{
	/* Timeline Item */
}

type TimelineItemProps = {
	title: string;
	subtitle: string;
	meta: string;
	index: number;
	children?: React.ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
function TimelineItem({ title, subtitle, meta, index, children }: TimelineItemProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				el.style.opacity = "1";
				el.style.transform = "translateY(0)";
				observer.disconnect();
			}
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} className="relative mb-8 pl-8">
			{/* Dot */}
			<span className="absolute top-2 left-0 h-3 w-3 rounded-full bg-olive-500" />

			{/* Card */}
			<div
				className="fade-in-up rounded-lg bg-neutral-900 p-4 transition-all duration-200 hover:scale-[1.02]"
				style={{ "--delay-index": index } as React.CSSProperties}
			>
				<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
					<h2 className="text-sm font-semibold sm:text-base">{title}</h2>
					<span className="text-xs opacity-40">{meta}</span>
				</div>
				<p className="mt-1 text-sm opacity-50">{subtitle}</p>
				{children}
			</div>
		</div>
	);
}
