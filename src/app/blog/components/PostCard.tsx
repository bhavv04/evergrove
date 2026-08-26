import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";

interface PostCardProps {
	post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
	const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC"
	});

	const formattedUpdatedDate = post.updatedAt
		? new Date(post.updatedAt).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
				timeZone: "UTC"
			})
		: null;

	return (
		<Link href={`/blog/${post.slug}`} className="group block rounded-xl bg-neutral-900 p-6 transition-all duration-200 hover:scale-[1.01]">
			<div className="flex items-start justify-between">
				<div className="flex flex-col gap-2">
					<time className="text-sm text-white/40">
						{formattedDate}
						{formattedUpdatedDate && formattedUpdatedDate !== formattedDate && (
							<span className="text-white/30">, last updated on {formattedUpdatedDate}</span>
						)}
					</time>
					<h2 className="transition-colors">{post.title}</h2>
					<p className="text-white/50">{post.excerpt}</p>
				</div>
			</div>
		</Link>
	);
}
