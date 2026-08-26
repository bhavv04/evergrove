"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { SiSsrn } from "react-icons/si";
import type { CaseStudy } from "@/lib/research/model";
import { Button } from "@/components/ui/Button";
import { TechnologyBadge } from "@/components/common/TechnologyBadges";
import { Technology } from "@/lib/common";

const STACK_TO_TECHNOLOGY: Partial<Record<string, Technology>> = {
	Python: Technology.Python,
	PyTorch: Technology.PyTorch,
	"scikit-learn": Technology.ScikitLearn,
	pandas: Technology.Pandas,
	Jupyter: Technology.Jupyter,
	TypeScript: Technology.TypeScript,
	Statsmodels: Technology.Statsmodels
};

export function CaseStudyCard({ study }: { study: CaseStudy }) {
	const badges = study.stack.map((s) => STACK_TO_TECHNOLOGY[s]).filter((t): t is Technology => t !== undefined);

	return (
		<article className="flex flex-col gap-4 py-4">
			{/* Title */}
			<div className="space-y-1">
				<h3 className="text-4xl">{study.title}</h3>
				<p className="text-sm text-white/50">{study.subtitle}</p>
			</div>

			{/* Summary */}
			<p className="text-sm text-white/70">{study.tagline}</p>

			{/* Tech badges */}
			{badges.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{badges.map((t) => (
						<TechnologyBadge key={t} technology={t} />
					))}
				</div>
			)}

			{/* Key methods */}
			{study.highlights && study.highlights.length > 0 && (
				<ul className="space-y-1.5 text-sm">
					{study.highlights.map((h) => (
						<li key={h} className="flex items-start gap-2">
							<span className="shrink-0 text-white/70">❀</span>
							<span className="text-white/70">{h}</span>
						</li>
					))}
				</ul>
			)}

			{/* Links */}
			<div className="flex flex-wrap gap-1.5">
				{study.links.repo && (
					<Button asChild variant="default">
						<Link href={study.links.repo} target="_blank" rel="noopener noreferrer">
							<FiGithub size={16} />
							Source
						</Link>
					</Button>
				)}
				{study.links.SSRN && (
					<Button asChild variant="default">
						<Link href={study.links.SSRN} target="_blank" rel="noopener noreferrer">
							<SiSsrn size={16} />
							SSRN
						</Link>
					</Button>
				)}
				{study.links.paper && (
					<Button asChild variant="default">
						<Link href={study.links.paper} target="_blank" rel="noopener noreferrer">
							<FileText size={16} />
							Paper
						</Link>
					</Button>
				)}
				{study.hasCaseStudy && (
					<Button asChild variant="default" className="">
						<Link href={`/research/${study.slug}`}>See more ⤳</Link>
					</Button>
				)}
			</div>
		</article>
	);
}
