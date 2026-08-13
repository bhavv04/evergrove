// scripts/generate-widget-tracks.ts
import { writeFileSync } from "fs";
import { Vibrant } from "node-vibrant/node";
import { album } from "@/lib/widget/Album";

interface ITunesResult {
	trackId: number;
	trackName: string;
	artistName: string;
	artworkUrl100: string;
	previewUrl: string;
}

interface Track {
	id: string;
	title: string;
	artist: string;
	cover: string;
	previewUrl: string;
	bgFrom: string;
	bgTo: string;
}

// map of "Artist - Title" → known-correct iTunes track ID, for songs where search picks the wrong result
const trackIdOverrides: Record<string, string> = {};

async function extractGradient(imageUrl: string): Promise<{ from: string; to: string }> {
	try {
		const palette = await Vibrant.from(imageUrl).getPalette();

		const from = palette.DarkMuted?.hex ?? palette.Muted?.hex ?? "#1a1a1a";
		const to = palette.Vibrant?.hex ?? palette.DarkVibrant?.hex ?? palette.LightMuted?.hex ?? "#333333";

		return { from, to };
	} catch (err) {
		console.warn(`Color extraction failed for ${imageUrl}, using fallback`, err);
		return { from: "#1a1a1a", to: "#333333" };
	}
}

async function fetchTrack(artist: string, title: string): Promise<Omit<Track, "bgFrom" | "bgTo"> | null> {
	const term = encodeURIComponent(`${artist} ${title}`);
	const res = await fetch(`https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=10`);

	if (!res.ok) {
		console.error(`Failed to fetch "${title}" by ${artist}: ${res.status}`);
		return null;
	}

	const data = await res.json();
	const results: ITunesResult[] = data.results;

	const exactMatch = results.find(
		(r) => r.artistName.toLowerCase().includes(artist.toLowerCase()) && r.trackName.toLowerCase().includes(title.toLowerCase())
	);

	const result = exactMatch ?? results.find((r) => r.artistName.toLowerCase().includes(artist.toLowerCase())) ?? results[0];

	if (!result) {
		console.warn(`No results for "${title}" by ${artist}`);
		return null;
	}

	if (!exactMatch) {
		console.warn(`⚠ No exact title match for "${title}" by ${artist} — using "${result.trackName}" by ${result.artistName}`);
	}

	return {
		id: String(result.trackId),
		title: result.trackName,
		artist: result.artistName,
		cover: result.artworkUrl100.replace("100x100", "400x400"),
		previewUrl: result.previewUrl
	};
}

async function fetchTrackById(trackId: string): Promise<Omit<Track, "bgFrom" | "bgTo"> | null> {
	const res = await fetch(`https://itunes.apple.com/lookup?id=${trackId}`);

	if (!res.ok) {
		console.error(`Failed to fetch track ID ${trackId}: ${res.status}`);
		return null;
	}

	const data = await res.json();
	const result: ITunesResult | undefined = data.results[0];

	if (!result) {
		console.warn(`No result found for track ID ${trackId}`);
		return null;
	}

	return {
		id: String(result.trackId),
		title: result.trackName,
		artist: result.artistName,
		cover: result.artworkUrl100.replace("100x100", "400x400"),
		previewUrl: result.previewUrl
	};
}

async function run() {
	const tracks: Track[] = [];

	for (const song of album) {
		const overrideKey = `${song.artist} - ${song.title}`;
		const overrideId = trackIdOverrides[overrideKey];

		const track = overrideId ? await fetchTrackById(overrideId) : await fetchTrack(song.artist, song.title);

		if (track) {
			const { from, to } = await extractGradient(track.cover);
			tracks.push({ ...track, bgFrom: from, bgTo: to });
			console.log(`✓ ${track.artist} - ${track.title} (${from} → ${to})`);
		} else {
			console.error(`✗ Could not find "${song.title}" by ${song.artist}`);
		}

		await new Promise((r) => setTimeout(r, 300));
	}

	writeFileSync("./src/lib/widget/album-tracks.json", JSON.stringify(tracks, null, 2));
	console.log(`\nSaved ${tracks.length}/${album.length} tracks to album.json`);
}

run();
