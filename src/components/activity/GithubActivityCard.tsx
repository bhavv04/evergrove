// @/components/activity/GithubActivityCard.tsx
import Link from "next/link";
import type { Commit } from "@/lib/activity/activity";
import { FiActivity } from "react-icons/fi";

interface LanguageStat {
	name: string;
	percent: number; // 0-100
	color: string;
}

interface GithubActivityCardProps {
	commits: Commit[];
	languages?: LanguageStat[];
}

function LanguageBar({ languages }: { languages: LanguageStat[] }) {
	if (languages.length === 0) return null;

	return (
		<div className="flex h-1.5 w-full overflow-visible rounded-full">
			{languages.map((lang) => (
				<div
					key={lang.name}
					className="group/seg relative h-full min-w-[2px] first:rounded-l-full last:rounded-r-full"
					style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
				>
					<span className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded-md bg-black/90 px-2 py-1 text-2xs whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover/seg:opacity-100">
						{lang.name} · {lang.percent}%
					</span>
				</div>
			))}
		</div>
	);
}

export default function GithubActivityCard({ commits, languages = [] }: GithubActivityCardProps) {
	return (
		<div className="flex h-full flex-col gap-4 rounded-xl bg-transparent p-2">
			<h3 className="flex items-center gap-1.5 text-sm text-white/70">
				<FiActivity size={16} />
				Recent commits
			</h3>
			<ul className="flex flex-col gap-3">
				{commits.map((commit, i) => {
					const formattedDate = new Date(commit.date).toLocaleDateString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
						timeZone: "UTC"
					});

					return (
						<li key={i}>
							<Link href={commit.url} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between gap-4">
								<span className="truncate">
									<span className="text-white/40 before:mr-1.5 before:content-['❀']">{commit.repo}:</span>{" "}
									<span className="transition-colors group-hover:text-white/70">{commit.message}</span>
								</span>
								<time className="shrink-0 text-xs text-white/40">{formattedDate}</time>
							</Link>
						</li>
					);
				})}
			</ul>

			<LanguageBar languages={languages} />
		</div>
	);
}
