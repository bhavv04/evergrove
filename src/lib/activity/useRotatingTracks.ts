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

// Remove duplicate ids from the source list. This is the root cause of most
// "same song twice" bugs — if allTracks itself has two entries with the same
// id, filtering by id-not-in-queue can't catch that, since both entries pass.
function dedupeById<T extends { id: string }>(arr: T[]): T[] {
	const seen = new Set<string>();
	const out: T[] = [];
	for (const t of arr) {
		if (!seen.has(t.id)) {
			seen.add(t.id);
			out.push(t);
		}
	}
	return out;
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

/**
 * Pull the next track from `pool` that isn't already in `excludeIds`.
 * Skips (drops) any pool entries that are somehow already present — this is
 * the safety net that guarantees the returned track (if any) is never a
 * duplicate of something already in the queue, regardless of how the pool
 * was built. Reshuffles from `allTracks` if the pool runs dry mid-search.
 *
 * Returns [next track or null, remaining pool] and never mutates its inputs.
 */
function popNextUnique<T extends { id: string }>(pool: T[], excludeIds: Set<string>, allTracks: T[]): [T | null, T[]] {
	let remaining = [...pool];

	// Bound the number of attempts so we can never loop forever (e.g. if
	// count >= allTracks.length there may be nothing valid to return).
	const maxAttempts = allTracks.length + 1;

	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		if (remaining.length === 0) {
			const refill = shuffle(allTracks.filter((t) => !excludeIds.has(t.id)));
			if (refill.length === 0) return [null, []];
			remaining = refill;
		}

		const [candidate, ...rest] = remaining;
		remaining = rest;

		if (candidate && !excludeIds.has(candidate.id)) {
			return [candidate, remaining];
		}
		// candidate was a stale duplicate — drop it and keep looking
	}

	return [null, remaining];
}

export function useRotatingTracks<T extends { id: string }>(allTracks: T[], count: number) {
	const poolRef = useRef<T[]>([]);
	const [queue, setQueue] = useState<T[]>([]);
	const initialized = useRef(false);

	// initialize once: restore from localStorage, or shuffle fresh if none saved
	useEffect(() => {
		if (allTracks.length === 0 || initialized.current) return;
		initialized.current = true;

		const uniqueTracks = dedupeById(allTracks);
		const saved = loadState<T>();

		if (saved && saved.queue.length === count) {
			// Rebuild queue/pool from saved state, but re-run everything through
			// dedupeById + popNextUnique so any pre-existing duplicates (from an
			// older buggy save) get cleaned up rather than perpetuated.
			let currentQueue = dedupeById(saved.queue);
			let currentPool = dedupeById(saved.pool);
			let lastAddedAt = saved.lastAddedAt;

			const elapsed = Date.now() - lastAddedAt;
			const missedTicks = Math.floor(elapsed / ADD_INTERVAL_MS);

			for (let i = 0; i < missedTicks; i++) {
				const excludeIds = new Set(currentQueue.map((t) => t.id));
				const [next, remainingPool] = popNextUnique(currentPool, excludeIds, uniqueTracks);
				if (!next) break;
				currentQueue = [next, ...currentQueue.slice(0, count - 1)];
				currentPool = remainingPool;
				lastAddedAt += ADD_INTERVAL_MS;
			}

			setQueue(currentQueue);
			poolRef.current = currentPool;
			saveState({ queue: currentQueue, pool: currentPool, lastAddedAt });
		} else {
			// no valid saved state — shuffle fresh
			const shuffled = shuffle(uniqueTracks);
			const initialQueue = shuffled.slice(0, count);
			const initialPool = shuffled.slice(count);

			setQueue(initialQueue);
			poolRef.current = initialPool;
			saveState({ queue: initialQueue, pool: initialPool, lastAddedAt: Date.now() });
		}
	}, [allTracks, count]);

	// ongoing interval while the tab stays open
	useEffect(() => {
		const uniqueTracks = dedupeById(allTracks);
		if (uniqueTracks.length <= count) return;

		const interval = setInterval(() => {
			setQueue((current) => {
				const excludeIds = new Set(current.map((t) => t.id));
				const [next, remainingPool] = popNextUnique(poolRef.current, excludeIds, uniqueTracks);
				if (!next) return current;

				poolRef.current = remainingPool;
				const updated = [next, ...current.slice(0, count - 1)];
				saveState({ queue: updated, pool: remainingPool, lastAddedAt: Date.now() });
				return updated;
			});
		}, ADD_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [allTracks, count]);

	return queue;
}
