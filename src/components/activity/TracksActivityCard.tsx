"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PiPlayFill, PiPauseFill } from "react-icons/pi";
import EqualizerBars from "@/components/activity/EqualizerBars";
import { GoIssueTracks } from "react-icons/go";

interface Track {
	id: string;
	title: string;
	artist: string;
	cover: string;
	previewUrl: string;
	startAt?: number;
	bgFrom: string;
	bgTo: string;
}

const SNIPPET_SECONDS = 15;

export default function TracksActivityCard({ tracks }: { tracks: Track[] }) {
	const [playingId, setPlayingId] = useState<string | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const stopTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const stopPlayback = () => {
		audioRef.current?.pause();
		if (audioRef.current) audioRef.current.currentTime = 0;
		if (stopTimeout.current) clearTimeout(stopTimeout.current);
		setPlayingId(null);
	};

	const togglePlay = (track: Track) => {
		if (playingId === track.id) {
			stopPlayback();
			return;
		}

		if (audioRef.current) audioRef.current.pause();
		if (stopTimeout.current) clearTimeout(stopTimeout.current);

		const audio = new Audio(track.previewUrl);
		audioRef.current = audio;

		audio.addEventListener("loadedmetadata", () => {
			audio.currentTime = track.startAt ?? 0;
			audio.play();
		});

		setPlayingId(track.id);
		stopTimeout.current = setTimeout(stopPlayback, SNIPPET_SECONDS * 1000);
		audio.onended = stopPlayback;
	};

	return (
		<div className="p-3">
			<h3 className="mb-3 flex items-center gap-2 text-sm text-white/60">
				<GoIssueTracks className="text-base" />
				Recent Tracks
			</h3>
			<ul className="grid gap-x-6 gap-y-1 py-1 sm:grid-cols-2">
				{tracks.map((track) => {
					const isPlaying = playingId === track.id;
					return (
						<li key={track.id} className="min-w-0">
							<button onClick={() => togglePlay(track)} className="group flex w-full items-center gap-3 rounded-lg py-2 text-left">
								<div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
									<Image
										src={track.cover}
										alt={track.title}
										fill
										className={`rounded-full object-cover ${isPlaying ? "animate-[spin_3s_linear_infinite]" : ""}`}
									/>
									<div
										className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/40 transition-opacity ${
											isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
										}`}
									>
										{isPlaying && <EqualizerBars />}
									</div>
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-white">{track.title}</p>
									<p className="truncate text-xs text-white/50">{track.artist}</p>
								</div>
								<span className="shrink-0 rounded-full bg-white/90 p-2 text-black group-hover:bg-white/60">
									{isPlaying ? <PiPauseFill size={18} /> : <PiPlayFill size={18} />}
								</span>
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
