// lib/activity/useRotatingTracks.ts
"use client";

import { useEffect, useRef, useState } from "react";

const ADD_INTERVAL_MS = 30 * 60 * 1000; // ~30 min between new songs
const STORAGE_KEY = "rotating-tracks-state";

function shuffle<T>(arr: T[]): T[] {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

interface StoredState<T> {
	queue: T[];
	pool: T[];
	lastAddedAt: number;
}

function loadState<T>(): StoredState<T> | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as StoredState<T>) : null;
	} catch {
		return null;
	}
}

function saveState<T>(state: StoredState<T>) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// ignore quota/serialization errors
	}
}

export function useRotatingTracks<T extends { id: string }>(allTracks: T[], count: number) {
	const poolRef = useRef<T[]>([]);
	const [queue, setQueue] = useState<T[]>([]);
	const initialized = useRef(false);

	// initialize once: restore from localStorage, or shuffle fresh if none saved
	useEffect(() => {
		if (allTracks.length === 0 || initialized.current) return;
		initialized.current = true;

		const saved = loadState<T>();

		if (saved && saved.queue.length === count) {
			// figure out how many intervals have elapsed since we last saved
			const elapsed = Date.now() - saved.lastAddedAt;
			const missedTicks = Math.floor(elapsed / ADD_INTERVAL_MS);

			let currentQueue = saved.queue;
			let currentPool = saved.pool.length > 0 ? saved.pool : shuffle(allTracks.filter((t) => !currentQueue.some((c) => c.id === t.id)));
			let lastAddedAt = saved.lastAddedAt;

			// fast-forward any ticks that happened while the tab was closed
			for (let i = 0; i < missedTicks; i++) {
				if (currentPool.length === 0) {
					currentPool = shuffle(allTracks.filter((t) => !currentQueue.some((c) => c.id === t.id)));
				}
				const next = currentPool.shift();
				if (!next) break;
				currentQueue = [next, ...currentQueue.slice(0, count - 1)];
				lastAddedAt += ADD_INTERVAL_MS;
			}

			setQueue(currentQueue);
			poolRef.current = currentPool;
			saveState({ queue: currentQueue, pool: currentPool, lastAddedAt });
		} else {
			// no valid saved state — shuffle fresh
			const shuffled = shuffle(allTracks);
			const initialQueue = shuffled.slice(0, count);
			const initialPool = shuffled.slice(count);

			setQueue(initialQueue);
			poolRef.current = initialPool;
			saveState({ queue: initialQueue, pool: initialPool, lastAddedAt: Date.now() });
		}
	}, [allTracks, count]);

	// ongoing interval while the tab stays open
	useEffect(() => {
		if (allTracks.length <= count) return;

		const interval = setInterval(() => {
			setQueue((current) => {
				if (poolRef.current.length === 0) {
					poolRef.current = shuffle(allTracks.filter((t) => !current.some((c) => c.id === t.id)));
				}

				const next = poolRef.current.shift();
				if (!next) return current;

				const updated = [next, ...current.slice(0, count - 1)];
				saveState({ queue: updated, pool: poolRef.current, lastAddedAt: Date.now() });
				return updated;
			});
		}, ADD_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [allTracks, count]);

	return queue;
}
