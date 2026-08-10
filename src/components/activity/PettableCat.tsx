"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const EYES: Record<string, string> = {
	sleeping: "-",
	idle: "o",
	happy: "^",
	blink: "-",
	blep: "^",
	dizzy: "@",
	overpetted: "x"
};

const TOPMARK: Record<string, string> = {
	sleeping: "zzZ",
	idle: "",
	happy: "♪~",
	blink: "",
	blep: ":p",
	dizzy: "@_@",
	overpetted: "#!?"
};

const PURRS = ["purr~", "mrow~", "prrrp", "mew!"];
const HISSES = ["hey!!", "too much!", "hnnngh", "not so fast!"];
const OVERPET_LINES = ["okay STOP", "I'M DIZZY", "too much!!", "aaahh--"];
const DIZZY_THRESHOLD = 3;
const OVERPET_THRESHOLD = 6; // clicks while already dizzy before it maxes out
const AGGRESSIVE_GAP_MS = 300;
const MAX_VISIBLE_LOG = 10;

type EventType = "pet" | "aggressive" | "dizzy" | "overpet";
type CatEvent = { type: EventType; at: number };
type CatState = { pets: number; dizzy: number; log: CatEvent[] };

const LOG_COPY: Record<EventType, string> = {
	pet: "someone pet the cat",
	aggressive: "someone pet the cat aggressively",
	dizzy: "someone made the cat dizzy",
	overpet: "someone kept petting the dizzy cat"
};

const LOG_COLOR: Record<EventType, string> = {
	pet: "text-white/50",
	aggressive: "text-orange-400",
	dizzy: "text-amber-400",
	overpet: "text-red-400"
};

function timeAgo(ts: number) {
	const s = Math.floor((Date.now() - ts) / 1000);
	if (s < 5) return "just now";
	if (s < 60) return `${s}s ago`;
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	return `${h}h ago`;
}

export default function PettableCat() {
	const [state, setState] = useState<CatState | null>(null);
	const [petting, setPetting] = useState(false);
	const [blinking, setBlinking] = useState(false);
	const [purr, setPurr] = useState(PURRS[0]);
	const [streak, setStreak] = useState(0);
	const [isDizzy, setIsDizzy] = useState(false);
	const [overpetted, setOverpetted] = useState(false);
	const [awake, setAwake] = useState(false);
	const [shakeSeed, setShakeSeed] = useState(0);
	const [wasAggressive, setWasAggressive] = useState(false);

	const lastPetAt = useRef(0);
	const dizzyPetsRef = useRef(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const dizzyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const sleepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		fetch("/api/cat")
			.then((r) => r.json())
			.then(setState)
			.catch(() => setState({ pets: 0, dizzy: 0, log: [] }));
	}, []);

	const report = useCallback(async (type: EventType) => {
		try {
			const res = await fetch("/api/cat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type })
			});
			const data: { pets: number; dizzy: number } = await res.json();
			setState((prev) => ({
				pets: data.pets,
				dizzy: data.dizzy,
				log: [{ type, at: Date.now() }, ...(prev?.log ?? [])].slice(0, 40)
			}));
		} catch {
			// fail silently, local UI already updated optimistically
		}
	}, []);

	const armDizzyTimeout = useCallback(() => {
		if (dizzyTimeoutRef.current) clearTimeout(dizzyTimeoutRef.current);
		dizzyTimeoutRef.current = setTimeout(() => {
			setIsDizzy(false);
			setOverpetted(false);
			setStreak(0);
			dizzyPetsRef.current = 0;
		}, 2500);
	}, []);

	const pet = useCallback(() => {
		const now = Date.now();
		const gap = now - lastPetAt.current;
		const isAggressive = lastPetAt.current !== 0 && gap < AGGRESSIVE_GAP_MS;
		lastPetAt.current = now;

		setWasAggressive(isAggressive);
		setShakeSeed((k) => k + 1);

		setAwake(true);
		if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
		sleepTimeoutRef.current = setTimeout(() => setAwake(false), 8000);

		setPetting(true);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => setPetting(false), 350);

		// Already dizzy: clicking through it, don't re-run the streak logic.
		// Every click here extends the dizzy window and pushes toward "overpetted".
		if (isDizzy) {
			dizzyPetsRef.current += 1;
			armDizzyTimeout();

			if (dizzyPetsRef.current >= OVERPET_THRESHOLD) {
				setOverpetted(true);
				setPurr(OVERPET_LINES[Math.floor(Math.random() * OVERPET_LINES.length)]);
				report("overpet");
			} else {
				setPurr(HISSES[Math.floor(Math.random() * HISSES.length)]);
				report("aggressive");
			}
			return;
		}

		setPurr(isAggressive ? HISSES[Math.floor(Math.random() * HISSES.length)] : PURRS[Math.floor(Math.random() * PURRS.length)]);

		setStreak((s) => {
			const next = s + 1;
			if (next >= DIZZY_THRESHOLD) {
				setIsDizzy(true);
				dizzyPetsRef.current = 0;
				report("dizzy");
				armDizzyTimeout();
				return 0;
			}
			return next;
		});

		report(isAggressive ? "aggressive" : "pet");
	}, [isDizzy, report, armDizzyTimeout]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (awake && !petting && !isDizzy) {
				setBlinking(true);
				setTimeout(() => setBlinking(false), 150);
			}
		}, 3500);
		return () => clearInterval(interval);
	}, [petting, isDizzy, awake]);

	const mood = overpetted
		? "overpetted"
		: isDizzy
			? "dizzy"
			: !awake
				? "sleeping"
				: petting
					? streak % 6 === 0
						? "blep"
						: "happy"
					: blinking
						? "blink"
						: "idle";

	const visibleLog = state?.log.slice(0, MAX_VISIBLE_LOG) ?? [];

	return (
		<div className="relative flex h-full w-full flex-col overflow-hidden p-4">
			<h3 className="mb-3 flex items-center gap-2 text-sm text-white/60">say hi</h3>

			{/* Log */}
			<div className="relative flex-1 overflow-hidden pr-24 sm:pr-30">
				<ul className="flex max-h-45 flex-col gap-1 text-3xs sm:text-xs">
					{!visibleLog.length && <li className="text-white/40">no one&apos;s said hi yet</li>}
					{visibleLog.map((e, i) => (
						<li key={`${e.at}-${i}`} className={`flex items-center justify-between gap-2 ${LOG_COLOR[e.type]}`}>
							<span className="">{LOG_COPY[e.type]}</span>
							<span className="shrink-0 text-white/30">{timeAgo(e.at)}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Standing cat, tucked into the bottom-right corner */}
			<div
				onClick={pet}
				className="group absolute right-2 bottom-5 flex flex-col items-center justify-end select-none"
				title={overpetted ? "okay, that's enough" : isDizzy ? "keep going or let it recover" : "pet the cat"}
			>
				<span className="text-2xs text-white/40 opacity-0 transition-opacity group-hover:opacity-100">
					{overpetted ? "overpetted!" : isDizzy ? "dizzy..." : !awake ? "shh, sleeping" : petting ? purr : "click to pet"}
				</span>

				<div className="h-3 text-2xs leading-none text-white/50">{TOPMARK[mood]}</div>

				<pre
					key={shakeSeed}
					className={`text-center text-sm leading-tight whitespace-pre text-white/70 ${
						!awake ? "opacity-60" : ""
					} ${isDizzy || overpetted ? "animate-pulse" : ""} ${overpetted ? "shake-mega" : wasAggressive ? "shake-hard" : "shake"}`}
				>
					{`  /\\___/\\
 =( ${EYES[mood]}.${EYES[mood]} )=
   >  ^  
  /|   |\\
 (_|___|_)`}
				</pre>
			</div>
		</div>
	);
}
