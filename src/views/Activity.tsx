// @/views/Activity.tsx
import BlogActivityCard from "@/components/activity/BlogActivityCard";
import GithubActivityCard from "@/components/activity/GithubActivityCard";
import { SectionTitle } from "@/components/typography/SectionTitle";
import { getSortedPostsMeta } from "@/lib/blog/posts";
import { getLatestCommits, getLanguages } from "@/lib/activity/activity";
import { PiPersonSimpleHikeBold } from "react-icons/pi";
import TracksActivityCard from "@/components/activity/TracksActivityCard";
import favoriteTracks from "@/lib/activity/tracks.json";
import PettableCat from "@/components/activity/PettableCat";

export default async function Activity() {
	const posts = getSortedPostsMeta().slice(0, 5);
	const [commits, languages] = await Promise.all([getLatestCommits(), getLanguages()]);

	return (
		<section className="">
			<SectionTitle
				text={
					<span className="flex items-center gap-2 text-3xl">
						<PiPersonSimpleHikeBold />
						<span>Recent Activity</span>
					</span>
				}
			/>

			{/* Bento row: Github + Blog */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<GithubActivityCard commits={commits} languages={languages} />
				<BlogActivityCard posts={posts} />
			</div>

			{/* Second row: Tracks (bigger) + Sprite + Recent Reads */}
			<div className="mx-auto mt-2 grid grid-cols-1 items-start gap-2 md:grid-cols-7">
				<div className="col-span-4">
					<TracksActivityCard tracks={favoriteTracks} />
				</div>
				<div className="col-span-3 items-center justify-center">
					<PettableCat />
				</div>
			</div>
		</section>
	);
}
