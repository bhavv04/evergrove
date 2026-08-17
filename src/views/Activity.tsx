import BlogActivityCard from "@/components/activity/BlogActivityCard";
import GithubActivityCard from "@/components/activity/GithubActivityCard";
import { SectionTitle } from "@/components/typography/SectionTitle";
import { getSortedPostsMeta } from "@/lib/blog/posts";
import { getLatestCommits, getLanguages } from "@/lib/activity/activity";
import { PiPersonSimpleHikeBold } from "react-icons/pi";
import RecentReads from "@/components/activity/RecentReads";
import PettableCat from "@/components/activity/PettableCat";

export default async function Activity() {
	const posts = getSortedPostsMeta().slice(0, 5);
	const [commits, languages] = await Promise.all([getLatestCommits(), getLanguages()]);

	return (
		<section id="activity" className="">
			<SectionTitle
				text={
					<span className="flex items-center gap-2 text-3xl">
						<PiPersonSimpleHikeBold />
						<span>Recent Activity</span>
					</span>
				}
			/>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<GithubActivityCard commits={commits} languages={languages} />
				<BlogActivityCard posts={posts} />
			</div>

			<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-7">
				<div className="col-span-4">
					<RecentReads />
				</div>
				<div className="col-span-3">
					<PettableCat />
				</div>
			</div>
		</section>
	);
}
