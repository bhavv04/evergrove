import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { getProjectBySlug, getAllSlugs } from "@/lib/projects/posts";
import { ProjectStatusBadge } from "@/app/projects/components/projectstatus";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export async function generateStaticParams() {
	return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const project = await getProjectBySlug(slug);

	return (
		<article className="mx-auto max-w-4xl pb-16">
			<Link
				href="/projects"
				className="fade-in-up mb-5 inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
				style={{ "--delay-index": 0 } as React.CSSProperties}
			>
				<ArrowLeft size={16} />
				Back to Projects
			</Link>

			<header className="fade-in-up mb-4 flex items-start gap-3" style={{ "--delay-index": 1 } as React.CSSProperties}>
				{project.image && (
					<div className="relative h-12 w-12 shrink-0">
						<Image src={project.image} alt={`${project.title} logo`} fill className="object-contain" />
					</div>
				)}
				<div>
					<h1 className="text-3xl font-bold text-white">{project.title}</h1>
					<p className="text-sm text-stone-100/70 italic">{project.tagline}</p>
				</div>
			</header>

			<div className="fade-in-up mb-4 flex items-center gap-2" style={{ "--delay-index": 2 } as React.CSSProperties}>
				<ProjectStatusBadge status={project.status} />
				{project.featured && <span className="rounded-full bg-violet-500/20 px-2 text-xs text-violet-300">featured</span>}
			</div>

			<div
				className="fade-in-up prose mb-8 max-w-none text-white prose-invert prose-headings:mt-6 prose-headings:mb-2"
				style={{ "--delay-index": 4 } as React.CSSProperties}
				dangerouslySetInnerHTML={{ __html: project.contentHtml }}
			/>

			<div className="fade-in-up mb-4 flex flex-col gap-1" style={{ "--delay-index": 3 } as React.CSSProperties}>
				<span className="mb-2 text-xs text-white/70">made with:</span>
				<div className="flex flex-wrap gap-1">
					{project.tech.map((t) => (
						<span key={t} className="rounded-md bg-stone-900 px-2 py-1 text-xs text-white/70">
							{t}
						</span>
					))}
				</div>
			</div>

			<div className="fade-in-up flex gap-1.5" style={{ "--delay-index": 5 } as React.CSSProperties}>
				<Button asChild variant="default" className="">
					<Link href={project.github} target="_blank" rel="noopener noreferrer">
						<FiGithub size={18} />
						Source
					</Link>
				</Button>
				{project.live && (
					<Button asChild variant="default" className="">
						<Link href={project.live} target="_blank" rel="noopener noreferrer">
							<ExternalLink size={13} /> Live
						</Link>
					</Button>
				)}
			</div>
		</article>
	);
}
