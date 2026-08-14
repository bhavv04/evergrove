// lib/activity/useRotatingTracks.ts
"use client";

import { useEffect, useRef, useState } from "react";

const ADD_INTERVAL_MS = 30 * 60 * 1000; // ~45 min between new songs, tweak 30-60min
// const ADD_INTERVAL_MS = 5 * 1000; // TESTING: uncomment for fast cycling

function shuffle<T>(arr: T[]): T[] {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function useRotatingTracks<T extends { id: string }>(allTracks: T[], count: number) {
	// pool of tracks not currently shown, shuffled once
	const poolRef = useRef<T[]>([]);
	const [queue, setQueue] = useState<T[]>([]);

	// initialize on mount / when source data changes
	useEffect(() => {
		if (allTracks.length === 0) return;
		const shuffled = shuffle(allTracks);
		setQueue(shuffled.slice(0, count));
		poolRef.current = shuffled.slice(count);
	}, [allTracks, count]);

	useEffect(() => {
		if (allTracks.length <= count) return; // not enough tracks to rotate

		const interval = setInterval(() => {
			setQueue((current) => {
				// refill pool if exhausted, avoiding immediate repeats of what's on screen
				if (poolRef.current.length === 0) {
					poolRef.current = shuffle(allTracks.filter((t) => !current.some((c) => c.id === t.id)));
				}

				const next = poolRef.current.shift();
				if (!next) return current;

				// new track goes to front, oldest (last) gets pushed out
				return [next, ...current.slice(0, count - 1)];
			});
		}, ADD_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [allTracks, count]);

	return queue;
}
