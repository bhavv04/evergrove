"use client";

import { caseStudies } from "@/lib/research/data";
import { CaseStudyCard } from "@/components/research/CaseStudyCard";
import { SectionTitle } from "@/components/typography/SectionTitle";
import { Card, CardContent } from "@/components/ui/Card";
import { LuChartNetwork } from "react-icons/lu";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ResearchView() {
	return (
		<section id="research" className="">
			<SectionTitle
				text={
					<span className="flex items-center gap-2 text-3xl">
						<LuChartNetwork />
						<span>Case Studies</span>
					</span>
				}
			/>

			<Card>
				<CardContent className="flex flex-col px-4">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{caseStudies.map((study) => (
							<CaseStudyCard key={study.id} study={study} />
						))}
					</div>

					<div className="flex justify-end pt-2">
						<Link href="/research" className="group inline-flex items-center gap-1 text-sm text-white/50 transition-colors hover:text-white">
							Explore all Case Studies
							<ArrowUpRight size={16} className="transition-transform duration-200 group-hover:rotate-45" />
						</Link>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
