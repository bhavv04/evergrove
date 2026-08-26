import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { Project } from "@/app/projects/model";
import { ProjectStatusBadge } from "./projectstatus";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function ProjectCard({ project }: { project: Project }) {
	return (
		<div className="group/card flex flex-col overflow-hidden rounded-xl bg-neutral-900 transition-all duration-200 hover:scale-[1.01]">
			<div className="p-4">
				{/* Header row: logo + title/tagline side by side */}
				<div className="mb-3 flex items-start gap-3">
					{project.image ? (
						<div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-md transition-colors duration-200">
							<Image src={project.image} alt={`${project.title} logo`} fill className="object-contain" />
						</div>
					) : (
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10">
							<span className="text-sm text-white/30">{project.title.charAt(0)}</span>
						</div>
					)}

					<div className="min-w-0 flex-1">
						{/*<Link href={`/projects/${project.id}`}> */}
						<Link href={project.github} target="_blank" rel="noopener noreferrer">
							<h3 className="truncate text-lg">{project.title}</h3>
						</Link>
						<p className="text-xs text-stone-100/40 italic">{project.tagline}</p>
					</div>
				</div>

				{/* Status row */}
				<div className="mb-3 flex items-center gap-2">
					<ProjectStatusBadge status={project.status} />
					{project.featured && <span className="rounded-full bg-violet-500/10 px-2 text-xs text-violet-300">featured</span>}
				</div>

				{/* Description */}
				<p className="mb-4 text-sm leading-relaxed text-stone-100/60">{project.description}</p>

				{/* Tech Stack */}
				<div className="mb-3 flex flex-wrap gap-1">
					{project.tech.map((t) => (
						<span key={t} className="rounded-md bg-stone-300/10 px-2 py-1 text-xs text-white/60">
							{t}
						</span>
					))}
				</div>

				{/* Links */}
				<div className="mt-auto flex items-center justify-between">
					<div className="-mx-1 flex items-center">
						<Button asChild variant="primary" size="sm" className="">
							<Link href={project.github} target="_blank" rel="noopener noreferrer">
								<FiGithub size={13} /> Github
							</Link>
						</Button>
						{project.live && (
							<Button asChild variant="primary" size="sm" className="">
								<Link href={project.live} target="_blank" rel="noopener noreferrer">
									<ExternalLink size={13} /> Live
								</Link>
							</Button>
						)}
					</div>

					{project.hasCaseStudy && (
						<Button asChild variant="primary" size="sm" className="">
							<Link href={`/projects/${project.slug}`}>See more w</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
