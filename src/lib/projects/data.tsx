import { Project } from "./model";
import { Technology } from "@/lib/common";

export const projects: Project[] = [
	{
		name: "Thunderhead",
		summary:
			"A lightweight reverse proxy that scores the intent of incoming HTTP requests to detect and mitigate bot traffic - without relying on Cloudflare or third-party services.",
		logo: {
			src: "/images/projects/thunderhead.png",
			width: 128,
			height: 128
		},
		technologies: [Technology.Go, Technology.NextJS, Technology.TypeScript, Technology.Redis, Technology.Nginx, Technology.Docker, Technology.Git],
		links: {
			github: "https://github.com/bhavv04/thunderhead",
			live: "https://getthunderhead.vercel.app/"
		},
		hasCaseStudy: true,
		slug: "thunderhead",
		screenshots: [
			{
				name: "Thunderhead Overview",
				mobile: { src: "/images/thunderhead/thunderhead1.png", width: 800, height: 640 },
				desktop: { src: "/images/thunderhead/thunderhead1.png", width: 800, height: 640 }
			},
			{
				name: "Thunderhead Scoring",
				mobile: { src: "/images/thunderhead/thunderhead2.png", width: 800, height: 640 },
				desktop: { src: "/images/thunderhead/thunderhead2.png", width: 800, height: 640 }
			},
			{
				name: "Thunderhead Config",
				mobile: { src: "/images/thunderhead/thunderhead3.png", width: 800, height: 640 },
				desktop: { src: "/images/thunderhead/thunderhead3.png", width: 800, height: 640 }
			},
			{
				name: "Thunderhead Features",
				mobile: { src: "/images/thunderhead/thunderhead4.png", width: 800, height: 640 },
				desktop: { src: "/images/thunderhead/thunderhead4.png", width: 800, height: 640 }
			}
		],
		type: "bullets",
		bullets: [
			"Sits in front of any web app and passively scores each request's intent instead of relying on JS challenges or CAPTCHAs that hurt real users",
			"Combines multiple behavioral signals - crawl patterns, request rate, header anomalies - into a single 0-100 score to tell bots from humans without a single hard rule",
			"Responds proportionally to risk: lets low-score traffic through, slows down suspicious requests with a tarpit, and only blocks outright once a request is clearly malicious"
		]
	},
	{
		name: "Verrere",
		summary:
			"A full stack web application that lets users discover books through an interactive, swipe-based interface, persist personal shelves, and filter preferences by genre.",
		logo: {
			src: "/images/projects/verrere.png",
			width: 128,
			height: 128
		},
		technologies: [Technology.NextJS, Technology.TypeScript, Technology.TailwindCSS, Technology.PostgreSQL, Technology.Prisma, Technology.GraphQL],
		links: {
			github: "https://github.com/bhavv04/verrere",
			live: "https://verrere.vercel.app/"
		},
		hasCaseStudy: false,
		screenshots: [
			{
				name: "verrere Landing Page",
				mobile: { src: "/images/verrere/verrere1.png", width: 800, height: 640 },
				desktop: { src: "/images/verrere/verrere1.png", width: 800, height: 640 }
			},
			{
				name: "verrere Swipe Interface",
				mobile: { src: "/images/verrere/verrere2.png", width: 800, height: 640 },
				desktop: { src: "/images/verrere/verrere2.png", width: 800, height: 640 }
			},
			{
				name: "verrere Shelf",
				mobile: { src: "/images/verrere/verrere3.png", width: 800, height: 640 },
				desktop: { src: "/images/verrere/verrere3.png", width: 800, height: 640 }
			},
			{
				name: "verrere Genre Selection",
				mobile: { src: "/images/verrere/verrere4.png", width: 800, height: 640 },
				desktop: { src: "/images/verrere/verrere4.png", width: 800, height: 640 }
			}
		],
		type: "bullets",
		bullets: [
			"Turns book discovery into a swipe-based deck instead of a search bar, giving instant physics-based feedback on every drag",
			"Tracks every book a user has already seen so genre browsing never repeats a title, even across long sessions",
			"Saves liked books to a persistent shelf and syncs it across devices, so a user's picks are never tied to a single browser"
		]
	},
	{
		name: "Groat",
		summary:
			"A self-hosted LLM proxy that cuts your API bill by routing requests to cheaper models and caching semantically-similar responses - a drop-in LLM-compatible endpoint with no code changes required.",
		logo: {
			src: "/images/projects/groat.png",
			width: 128,
			height: 128
		},
		technologies: [
			Technology.Rust,
			Technology.Axum,
			Technology.Tokio,
			Technology.SQLite,
			Technology.SQLx,
			Technology.LanceDB,
			Technology.Candle,
			Technology.Docker,
			Technology.Git,
			Technology.Linux
		],
		links: {
			github: "https://github.com/bhavv04/groat",
			live: "https://getgroat.vercel.app/"
		},
		hasCaseStudy: true,
		slug: "groat",
		screenshots: [
			{
				name: "Groat Dashboard",
				mobile: { src: "/images/groat/groat1.png", width: 800, height: 640 },
				desktop: { src: "/images/groat/groat1.png", width: 800, height: 640 }
			},
			{
				name: "Groat Semantic Cache",
				mobile: { src: "/images/groat/groat2.png", width: 800, height: 640 },
				desktop: { src: "/images/groat/groat2.png", width: 800, height: 640 }
			},
			{
				name: "Groat Routing Config",
				mobile: { src: "/images/groat/groat3.png", width: 800, height: 640 },
				desktop: { src: "/images/groat/groat3.png", width: 800, height: 640 }
			}
		],
		type: "bullets",
		bullets: [
			"Drops in as an LLM-compatible endpoint, so it cuts LLM spend without touching a single line of an app's existing code",
			"Recognizes when a new prompt is semantically close to one it's already answered and returns the cached response instead of paying for another API call",
			"Watches real traffic over time and surfaces routing rules with estimated savings, so cost cuts are backed by usage data instead of guesswork"
		]
	},
	{
		name: "Funes",
		summary:
			"A local-first CLI tool that indexes your files, notes, and shell history, letting you query your machine's history in plain English - no cloud, no accounts, and no subscription.",
		logo: {
			src: "/images/projects/funes.png",
			width: 128,
			height: 128
		},
		technologies: [
			Technology.Rust,
			Technology.SQLite,
			Technology.Ollama,
			Technology.NextJS,
			Technology.TypeScript,
			Technology.TailwindCSS,
			Technology.Vercel,
			Technology.Git,
			Technology.Linux
		],
		links: {
			github: "https://github.com/bhavv04/funes",
			live: "https://get-funes.vercel.app"
		},
		hasCaseStudy: true,
		slug: "funes",
		screenshots: [
			{
				name: "Funes Terminal",
				mobile: { src: "/images/funes/funes1.png", width: 800, height: 640 },
				desktop: { src: "/images/funes/funes1.png", width: 800, height: 640 }
			},
			{
				name: "Funes Documentation Introduction",
				mobile: { src: "/images/funes/funes2.png", width: 800, height: 640 },
				desktop: { src: "/images/funes/funes2.png", width: 800, height: 640 }
			},
			{
				name: "Funes Documentation Installation",
				mobile: { src: "/images/funes/funes3.png", width: 800, height: 640 },
				desktop: { src: "/images/funes/funes3.png", width: 800, height: 640 }
			},
			{
				name: "Funes Documentation Configuration",
				mobile: { src: "/images/funes/funes4.png", width: 800, height: 640 },
				desktop: { src: "/images/funes/funes4.png", width: 800, height: 640 }
			}
		],
		type: "bullets",
		bullets: [
			"Lets you ask your own machine questions in plain English instead of grepping through files, notes, and shell history by hand",
			"Runs entirely on-device - indexing, embeddings, and answer generation all happen locally, so nothing about a user's files or history ever leaves the machine",
			"Finds results by meaning rather than exact keywords, so a vague or loosely-worded question can still surface the right file or command from months ago"
		]
	}
];
