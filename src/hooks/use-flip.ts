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
 * containerRef: the parent whose children you're reordering
 * deps: re-run the FLIP measurement when this changes (e.g. the
 *       array of visible ids/order, as a stable string or array)
 */
export function useFlip(containerRef: React.RefObject<HTMLElement | null>, deps: React.DependencyList, options: FlipOptions = {}) {
	const { duration = 400, easing = "cubic-bezier(0.22, 1, 0.36, 1)" } = options;

	// map of data-flip-id -> DOMRect, captured BEFORE this render's DOM change
	const prevRects = useRef<Map<string, DOMRect>>(new Map());

	// capture "before" positions synchronously, before paint, on every render
	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const children = Array.from(container.querySelectorAll<HTMLElement>("[data-flip-id]"));
		console.log("flip run, children found:", children.length, "prevRects size:", prevRects.current.size);

		const newRects = new Map<string, DOMRect>();
		for (const el of children) {
			const id = el.dataset.flipId!;
			newRects.set(id, el.getBoundingClientRect());
		}

		const toAnimate: { el: HTMLElement; dx: number; dy: number }[] = [];

		for (const el of children) {
			const id = el.dataset.flipId!;
			const prev = prevRects.current.get(id);
			const next = newRects.get(id);
			if (!prev || !next) continue;

			const dx = prev.left - next.left;
			const dy = prev.top - next.top;
			console.log(id, "dx:", dx, "dy:", dy);

			if (dx !== 0 || dy !== 0) {
				el.style.transform = `translate(${dx}px, ${dy}px)`;
				el.style.transition = "none";
				toAnimate.push({ el, dx, dy });
			}
		}

		// "Play": on the next frame, clear the transform with a transition
		// so the browser animates from the offset back to natural position
		if (toAnimate.length > 0) {
			requestAnimationFrame(() => {
				for (const { el } of toAnimate) {
					el.style.transition = `transform ${duration}ms ${easing}`;
					el.style.transform = "";
				}
			});

			// cleanup inline styles after the animation finishes
			const timeout = setTimeout(() => {
				for (const { el } of toAnimate) {
					el.style.transition = "";
				}
			}, duration);

			prevRects.current = newRects;
			return () => clearTimeout(timeout);
		}

		prevRects.current = newRects;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}
