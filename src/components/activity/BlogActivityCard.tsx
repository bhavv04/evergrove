// @/components/activity/BlogActivityCard.tsx
import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";
import { FaFilePen } from "react-icons/fa6";
import { ArrowUpRight } from "lucide-react";

interface BlogActivityCardProps {
	posts: PostMeta[];
}

export default function BlogActivityCard({ posts }: BlogActivityCardProps) {
	return (
		<div className="flex h-full flex-col gap-3 p-2">
			<div className="flex items-center justify-between">
				<h3 className="flex items-center gap-1.5 text-sm text-white/70">
					<FaFilePen size={16} />
					Latest Posts
				</h3>
				<Link href="/blog" className="group inline-flex items-center gap-1 text-sm text-white/50 transition-colors hover:text-white">
					Read all Posts
					<ArrowUpRight size={16} className="transition-transform duration-200 group-hover:rotate-45" />
				</Link>
			</div>
			<ul className="flex flex-col gap-3">
				{posts.map((post) => {
					const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
						timeZone: "UTC"
					});

					return (
						<li key={post.slug}>
							<Link href={`/blog/${post.slug}`} className="group flex items-baseline justify-between gap-4 transition-colors">
								<span className="truncate transition-colors group-hover:text-white/70 before:mr-1.5 before:content-['❀']">{post.title}</span>
								<time className="shrink-0 text-xs text-white/40">{formattedDate}</time>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
