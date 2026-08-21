// hooks/use-flip.ts
"use client";

import { useLayoutEffect, useRef } from "react";

interface FlipOptions {
	duration?: number; // ms
	easing?: string;
}

/**
 * FLIP animation for a list of keyed elements inside a container.
 * Call this every render — it measures positions before the DOM
 * update commits, then animates from old position to new position
 * after it commits.
 *
 * Also locks the container's height to its pre-update value and
 * eases it down to the new value in sync with the item animation.
 * Without this, removing items shrinks the container's natural
 * height in the same frame as the DOM commit (transforms don't
 * affect layout), which causes the page's scrollbar to appear/
 * disappear in a single frame — a visible flash.
 *
 * containerRef: the parent whose children you're reordering
 * deps: re-run the FLIP measurement when this changes (e.g. the
 *       array of visible ids/order, as a stable string or array)
 */
export function useFlip(containerRef: React.RefObject<HTMLElement | null>, deps: React.DependencyList, options: FlipOptions = {}) {
	const { duration = 400, easing = "cubic-bezier(0.22, 1, 0.36, 1)" } = options;

	// map of data-flip-id -> DOMRect, captured BEFORE this render's DOM change
	const prevRects = useRef<Map<string, DOMRect>>(new Map());
	// container height captured BEFORE this render's DOM change
	const prevHeight = useRef<number | null>(null);

	// capture "before" positions synchronously, before paint, on every render
	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const children = Array.from(container.querySelectorAll<HTMLElement>("[data-flip-id]"));

		const newRects = new Map<string, DOMRect>();
		for (const el of children) {
			const id = el.dataset.flipId!;
			newRects.set(id, el.getBoundingClientRect());
		}

		// New natural height, after the DOM update but before we lock anything
		const newHeight = container.getBoundingClientRect().height;

		const toAnimate: { el: HTMLElement; dx: number; dy: number }[] = [];

		for (const el of children) {
			const id = el.dataset.flipId!;
			const prev = prevRects.current.get(id);
			const next = newRects.get(id);
			if (!prev || !next) continue;

			const dx = prev.left - next.left;
			const dy = prev.top - next.top;

			if (dx !== 0 || dy !== 0) {
				el.style.transform = `translate(${dx}px, ${dy}px)`;
				el.style.transition = "none";
				toAnimate.push({ el, dx, dy });
			}
		}

		const heightChanged = prevHeight.current !== null && prevHeight.current !== newHeight;

		if (heightChanged) {
			// Freeze at the OLD height synchronously, before paint, so the
			// browser never sees the shrink happen in a single frame.
			container.style.height = `${prevHeight.current}px`;
			container.style.overflow = "hidden";
			container.style.transition = "none";
		}

		const playAnimations = () => {
			if (heightChanged) {
				container.style.transition = `height ${duration}ms ${easing}`;
				container.style.height = `${newHeight}px`;
			}
			for (const { el } of toAnimate) {
				el.style.transition = `transform ${duration}ms ${easing}`;
				el.style.transform = "";
			}
		};

		const cleanup = () => {
			if (heightChanged) {
				container.style.height = "";
				container.style.overflow = "";
				container.style.transition = "";
			}
			for (const { el } of toAnimate) {
				el.style.transition = "";
			}
		};

		if (toAnimate.length > 0 || heightChanged) {
			requestAnimationFrame(playAnimations);
			const timeout = setTimeout(cleanup, duration);

			prevRects.current = newRects;
			prevHeight.current = newHeight;
			return () => clearTimeout(timeout);
		}

		prevRects.current = newRects;
		prevHeight.current = newHeight;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}
