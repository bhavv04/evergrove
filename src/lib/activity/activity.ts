// @/lib/activity/activity.ts
const GITHUB_USER = "bhavv04";

interface GithubRepo {
	name: string;
	fork: boolean;
	archived: boolean;
	pushed_at: string;
}

interface Commit {
	repo: string;
	message: string;
	date: string;
	url: string;
}

interface LanguageStat {
	name: string;
	percent: number;
	color: string;
}

const EXCLUDED_REPOS = ["evergrove"]; // add any others to skip

// GitHub's linguist colors — add more as your repos use new languages
const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: "#3178c6",
	JavaScript: "#f1e05a",
	Rust: "#dea584",
	Python: "#3572A5",
	HTML: "#e34c26",
	CSS: "#563d7c",
	Shell: "#89e051",
	Dockerfile: "#384d54",
	TeX: "#3D6117",
	Go: "#00ADD8"
};

const FALLBACK_COLOR = "#ff0000"; // for languages not in the map above

const IGNORED_LANGUAGES = ["Jupyter Notebook"];

async function getRecentRepos(): Promise<GithubRepo[]> {
	const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=10`, {
		next: { revalidate: 3600 } // re-fetch at most once an hour
	});

	if (!res.ok) return [];

	const repos: GithubRepo[] = await res.json();

	return repos.filter((r) => !r.fork && !r.archived && !EXCLUDED_REPOS.includes(r.name));
}

async function getLatestCommits(): Promise<Commit[]> {
	const repos = await getRecentRepos();
	const topRepos = repos.slice(0, 5);

	const commitPromises = topRepos.map(async (repo) => {
		const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo.name}/commits?per_page=1`, { next: { revalidate: 3600 } });

		if (!res.ok) return null;

		const commits = await res.json();
		const latest = commits[0];
		if (!latest) return null;

		return {
			repo: repo.name,
			message: latest.commit.message.split("\n")[0],
			date: latest.commit.author.date,
			url: latest.html_url
		};
	});

	const results = await Promise.all(commitPromises);
	return results.filter((c): c is Commit => c !== null).slice(0, 4);
}

async function getLanguages(): Promise<LanguageStat[]> {
	const repos = await getRecentRepos();

	const languagePromises = repos.map(async (repo) => {
		const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo.name}/languages`, {
			next: { revalidate: 3600 }
		});

		if (!res.ok) return null;

		return (await res.json()) as Record<string, number>;
	});

	const results = await Promise.all(languagePromises);

	// sum bytes per language across all repos
	const totals: Record<string, number> = {};
	for (const langBytes of results) {
		if (!langBytes) continue;
		for (const [lang, bytes] of Object.entries(langBytes)) {
			totals[lang] = (totals[lang] ?? 0) + bytes;
		}
	}

	// filter BEFORE computing the total, so percentages recalculate against
	// only the languages you're actually keeping
	const filteredEntries = Object.entries(totals).filter(([name]) => !IGNORED_LANGUAGES.includes(name));

	const totalBytes = filteredEntries.reduce((sum, [, bytes]) => sum + bytes, 0);
	if (totalBytes === 0) return [];

	return filteredEntries
		.map(([name, bytes]) => ({
			name,
			percent: Math.round((bytes / totalBytes) * 1000) / 10, // one decimal
			color: LANGUAGE_COLORS[name] ?? FALLBACK_COLOR
		}))
		.sort((a, b) => b.percent - a.percent);
}

export { getLatestCommits, getLanguages };
export type { Commit, LanguageStat };
