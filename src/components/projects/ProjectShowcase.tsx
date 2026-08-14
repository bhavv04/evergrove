"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Carousel";
import { Button } from "@/components/ui/Button";
import { TechnologyBadge } from "@/components/common/TechnologyBadges";
import { cn } from "@/lib/utils";
import { Project } from "@/lib/projects/model";

interface ProjectShowcaseProps {
	project: Project;
	direction?: "row" | "row-reverse";
}

export function ProjectShowcase({ project, direction = "row" }: ProjectShowcaseProps) {
	const [activeIndex, setActiveIndex] = React.useState(0);
	const { name, summary, technologies, links, screenshots, logo } = project;
	const hasMultiple = screenshots.length > 1;

	return (
		<article className={cn("flex flex-col gap-6", direction === "row-reverse" ? "lg:flex-row-reverse" : "lg:flex-row")}>
			{/* Screenshots */}
			<div className="w-full sm:mr-4 lg:w-[55%]">
				<div className="-mx-4 sm:p-4">
					{/* Header */}
					<div className="mb-4 flex items-center justify-between px-1 text-xs text-white/50">
						<span>{name} screenshots</span>
						{hasMultiple && (
							<span>
								{activeIndex + 1} / {screenshots.length}
							</span>
						)}
					</div>

					{/* Carousel */}
					<Carousel
						opts={{ loop: hasMultiple }}
						setApi={(api) => {
							if (!api) return;
							setActiveIndex(api.selectedScrollSnap());
							api.on("select", () => setActiveIndex(api.selectedScrollSnap()));
						}}
					>
						<CarouselContent>
							{screenshots.map((screenshot, i) => (
								<CarouselItem key={screenshot.name}>
									<div className="overflow-hidden rounded-xl">
										<div className="relative aspect-16/10 w-full overflow-hidden">
											<Image
												src={screenshot.desktop.src}
												alt={`${name} - ${screenshot.name}`}
												width={screenshot.desktop.width}
												height={screenshot.desktop.height}
												className="hidden h-full w-full object-cover sm:block"
												priority={i === 0}
											/>
											<Image
												src={screenshot.mobile.src}
												alt={`${name} - ${screenshot.name}`}
												width={screenshot.mobile.width}
												height={screenshot.mobile.height}
												className="h-full w-full object-cover sm:hidden"
												priority={i === 0}
											/>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>

						{hasMultiple && (
							<div className="flex items-center justify-between pt-4">
								{/* Dot indicators */}
								<div className="flex gap-2">
									{screenshots.map((screenshot, i) => (
										<button
											key={screenshot.name}
											type="button"
											onClick={() => setActiveIndex(i)}
											aria-label={`Show ${screenshot.name}`}
											className={cn(
												"h-2.5 rounded-full transition-all duration-200",
												i === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/25 hover:bg-white/45"
											)}
										/>
									))}
								</div>

								{/* Prev / Next */}
								<div className="flex gap-2">
									<CarouselPrevious className="bg-neutral-800 text-white hover:bg-white hover:text-black" />
									<CarouselNext className="bg-neutral-800 text-white hover:bg-white hover:text-black" />
								</div>
							</div>
						)}
					</Carousel>
				</div>
			</div>

			{/* Info */}
			<div className="flex w-full flex-col gap-4 lg:w-1/2 lg:pt-2">
				<div className="space-y-2">
					<div className="flex items-center gap-3">
						{logo && (
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
								<Image src={logo.src} alt={`${name} logo`} width={logo.width} height={logo.height} className="h-full w-full object-contain" />
							</div>
						)}
						<h3 className="text-4xl">{name}</h3>
					</div>
					<p className="max-w-xl text-sm text-white/70 sm:text-base">{summary}</p>
				</div>

				<div className="flex flex-wrap gap-2">
					{technologies.map((technology) => (
						<TechnologyBadge key={technology} technology={technology} />
					))}
				</div>

				{project.type === "bullets" && project.bullets.length > 0 && (
					<ul className="space-y-2 rounded-xl text-sm">
						{project.bullets.map((bullet) => (
							<li key={bullet} className="flex items-start gap-2 text-sm">
								<span className="shrink-0 text-white/70">{` ❀ `}</span>
								<span>{bullet}</span>
							</li>
						))}
					</ul>
				)}

				<div className="flex flex-wrap gap-1.5">
					{links?.github && (
						<Button asChild variant="default" className="">
							<Link href={links.github} target="_blank" rel="noopener noreferrer">
								<FiGithub size={18} />
								Source
							</Link>
						</Button>
					)}
					{links?.live && (
						<Button asChild variant="default" className="">
							<Link href={links.live} target="_blank" rel="noopener noreferrer">
								<ExternalLink size={18} />
								Live
							</Link>
						</Button>
					)}
				</div>
			</div>
		</article>
	);
}
