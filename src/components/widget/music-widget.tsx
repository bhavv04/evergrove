// components/widget/music-widget.tsx
"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, type Transition } from "framer-motion";
import { useAudioPlayer } from "@/lib/audio/useAudioPlayer";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import outerWildsTracks from "@/lib/widget/outer-wilds-tracks.json";

function formatTime(seconds: number) {
	if (!seconds || isNaN(seconds)) return "0:00";
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicWidget() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const progressRef = useRef<HTMLDivElement>(null);
	const shouldReduceMotion = useReducedMotion();
	const { currentTrack, isPlaying, position, duration, volume, togglePlay, nextTrack, previousTrack, setVolume, seekTo } = useAudioPlayer(outerWildsTracks);

	const shellSpring: Transition = shouldReduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 420, damping: 38, mass: 0.8 };
	const contentFade: Transition = shouldReduceMotion ? { duration: 0.1 } : { duration: 0.14, ease: "easeOut" };

	useEffect(() => {
		if (!isExpanded) return;

		function handleClickOutside(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsExpanded(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isExpanded]);

	const getRatioFromEvent = useCallback((clientX: number) => {
		const bar = progressRef.current;
		if (!bar) return 0;
		const rect = bar.getBoundingClientRect();
		return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
	}, []);

	const handlePointerDown = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (!duration) return;
			setIsDragging(true);
			(e.target as HTMLElement).setPointerCapture(e.pointerId);
			seekTo(getRatioFromEvent(e.clientX) * duration);
		},
		[duration, seekTo, getRatioFromEvent]
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (!isDragging || !duration) return;
			seekTo(getRatioFromEvent(e.clientX) * duration);
		},
		[isDragging, duration, seekTo, getRatioFromEvent]
	);

	const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		setIsDragging(false);
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
	}, []);

	if (!currentTrack) return null;

	const progressPct = duration > 0 ? (position / duration) * 100 : 0;

	return (
		<div ref={containerRef} className="fixed top-6 right-4 z-50 lg:right-auto lg:left-4">
			<div className="relative h-11 w-44">
				<AnimatePresence initial={false} mode="popLayout">
					{!isExpanded ? (
						<motion.button
							key="collapsed"
							initial={{ opacity: 0, scale: 0.92 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.92 }}
							transition={shellSpring}
							style={{ transformOrigin: "top right" }}
							onClick={() => setIsExpanded(true)}
							className="absolute top-0 right-0 flex w-44 cursor-pointer items-center gap-2 overflow-hidden rounded-lg bg-white/5 p-2 pr-3 text-left backdrop-blur-xl backdrop-saturate-150"
							aria-label="Expand music player"
						>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={contentFade}
								className="flex w-full items-center gap-2"
							>
								<img src={currentTrack.cover} alt={currentTrack.title} className="h-8 w-8 shrink-0 rounded-md object-cover" />
								<div className="min-w-0 flex-1">
									<p className="truncate text-xs font-semibold text-white">{currentTrack.title}</p>
									<p className="truncate text-2xs text-white/50">{currentTrack.artist}</p>
								</div>
								{isPlaying ? <Pause size={16} fill="currentColor" className="" /> : <Play size={16} fill="currentColor" className="" />}
							</motion.div>

							<div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
								<div className="h-full bg-white" style={{ width: `${progressPct}%` }} />
							</div>
						</motion.button>
					) : (
						<motion.div
							key="expanded"
							initial={{ opacity: 0, scale: 0.92 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.92 }}
							transition={shellSpring}
							style={{ transformOrigin: "top right" }}
							onClick={() => setIsExpanded(false)}
							className="absolute top-0 right-0 w-75 overflow-hidden rounded-xl bg-white/5 p-3 shadow-xl shadow-black backdrop-blur-lg backdrop-saturate-150 lg:right-auto lg:left-0"
						>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ ...contentFade, delay: shouldReduceMotion ? 0 : 0.08 }}
								className="flex items-start gap-3"
							>
								<img src={currentTrack.cover} alt={currentTrack.title} className="h-24 w-24 shrink-0 rounded-lg object-cover" />

								<div className="min-w-0 flex-1">
									<div className="min-w-0">
										<p className="truncate text-xs font-semibold text-white">{currentTrack.title}</p>
										<p className="truncate text-xs text-white/50">{currentTrack.artist}</p>
									</div>

									<div
										ref={progressRef}
										onClick={(e) => e.stopPropagation()}
										onPointerDown={handlePointerDown}
										onPointerMove={handlePointerMove}
										onPointerUp={handlePointerUp}
										className="group/bar relative mt-2 flex h-3 cursor-pointer touch-none items-center"
									>
										<div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
											<div
												className="h-full rounded-full bg-white/85"
												style={{ width: `${progressPct}%`, transition: isDragging ? "none" : "width 0.15s ease-out" }}
											/>
										</div>
										<div
											className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow transition-opacity ${
												isDragging ? "opacity-100" : "opacity-0 group-hover/bar:opacity-100"
											}`}
											style={{ left: `calc(${progressPct}% - 4px)` }}
										/>
									</div>
									<div className="-mt-0.5 flex justify-between text-2xs text-white/35 tabular-nums">
										<span>{formatTime(position)}</span>
										<span>-{formatTime(Math.max(duration - position, 0))}</span>
									</div>

									<div className="mt-2 flex items-center gap-2.5">
										<button
											onClick={(e) => {
												e.stopPropagation();
												previousTrack();
											}}
											className="cursor-pointer text-white transition-all hover:scale-120 active:scale-95"
											aria-label="Previous track"
										>
											<SkipBack size={18} fill="currentColor" />
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												togglePlay();
											}}
											className="cursor-pointer text-white transition-transform hover:scale-120 active:scale-95"
											aria-label={isPlaying ? "Pause" : "Play"}
										>
											{isPlaying ? <Pause size={21} fill="currentColor" /> : <Play size={21} fill="currentColor" />}
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												nextTrack();
											}}
											className="cursor-pointer text-white transition-all hover:scale-120 active:scale-95"
											aria-label="Next track"
										>
											<SkipForward size={18} fill="currentColor" />
										</button>

										<div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
											<button
												onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
												className="text-white/40 transition-colors hover:text-white"
												aria-label={volume === 0 ? "Unmute" : "Mute"}
											>
												{volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
											</button>
											<input
												type="range"
												min={0}
												max={1}
												step={0.01}
												value={volume}
												onChange={(e) => setVolume(Number(e.target.value))}
												className="h-1 w-15 cursor-pointer touch-none appearance-none rounded-full bg-white/10 accent-white/70 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-150 [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:active:scale-125 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-125"
											/>
										</div>
									</div>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
