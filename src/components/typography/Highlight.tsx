"use client";

export type HighlightStyle =
	| "marker" // clean single-stroke, slight skew
	| "rough" // heavier skew, uneven overshoot, feels rushed
	| "bold" // thick coverage, barely skewed, confident
	| "underline" // thin mark sitting under the text instead of behind it
	| "scribble" // most chaotic, double overshoot, for emphasis
	| "double" // two overlapping strokes, like it was marked twice
	| "thin" // faint, narrow band, barely-there mark
	| "circle"; // rough hand-drawn circle/oval around the text, no fill behind

const STYLES: Record<
	Exclude<HighlightStyle, "circle" | "underline">,
	{ top: string; bottom: string; left: string; right: string; transform: string; opacity: string }
> = {
	marker: {
		top: "6%",
		bottom: "6%",
		left: "-3%",
		right: "-1%",
		transform: "skewX(-6deg) rotate(-0.5deg)",
		opacity: "opacity-70"
	},
	rough: {
		top: "2%",
		bottom: "10%",
		left: "-5%",
		right: "-2%",
		transform: "skewX(-10deg) rotate(-1.5deg)",
		opacity: "opacity-60"
	},
	bold: {
		top: "0%",
		bottom: "4%",
		left: "-2%",
		right: "-4%",
		transform: "skewX(-3deg) rotate(0.5deg)",
		opacity: "opacity-80"
	},
	scribble: {
		top: "-2%",
		bottom: "6%",
		left: "-6%",
		right: "-3%",
		transform: "skewX(-9deg) rotate(-2deg)",
		opacity: "opacity-75"
	},
	double: {
		top: "4%",
		bottom: "4%",
		left: "-4%",
		right: "-2%",
		transform: "skewX(-7deg) rotate(-1deg)",
		opacity: "opacity-65"
	},
	thin: {
		top: "22%",
		bottom: "22%",
		left: "-2%",
		right: "-1%",
		transform: "skewX(-4deg) rotate(-0.5deg)",
		opacity: "opacity-50"
	}
};

// Suggested light/pastel colors that read well as a highlight behind white text
// on a dark background. Pick any Tailwind bg-* class — these are just good defaults.
export const HIGHLIGHT_COLORS = {
	emerald: "bg-emerald-400",
	sky: "bg-sky-400",
	amber: "bg-amber-400",
	rose: "bg-rose-400",
	violet: "bg-violet-400",
	lime: "bg-lime-400",
	teal: "bg-teal-400",
	orange: "bg-orange-400"
} as const;

export function Highlight({
	children,
	color = "bg-emerald-300",
	style = "marker",
	width,
	className = ""
}: {
	children: React.ReactNode;
	color?: string;
	style?: HighlightStyle;
	width?: string;
	className?: string;
}) {
	const wrapperStyle = width ? { width, textAlign: "center" as const } : undefined;

	// Underline: thin mark below the baseline, not behind the text
	if (style === "underline") {
		return (
			<span className={`relative inline-block font-semibold whitespace-nowrap text-white ${className}`} style={wrapperStyle}>
				<span className="relative z-10">{children}</span>
				<span
					className={`absolute right-[-2%] bottom-[6%] left-[-2%] -z-0 h-[3px] ${color} opacity-80`}
					style={{ transform: "skewX(-4deg) rotate(-0.5deg)" }}
				/>
			</span>
		);
	}

	// Circle: rough hand-drawn oval outline, no fill
	if (style === "circle") {
		return (
			<span className={`relative inline-block px-1 font-semibold whitespace-nowrap text-white ${className}`} style={wrapperStyle}>
				<span className="relative z-10">{children}</span>
				<span
					className={`pointer-events-none absolute -inset-x-[6%] -inset-y-[10%] -z-0 rounded-[50%] border-2 ${color.replace("bg-", "border-")} opacity-70`}
					style={{ transform: "rotate(-2deg) skewX(-3deg)" }}
				/>
			</span>
		);
	}

	// Double: two overlapping strokes at slightly different angles, like marked twice
	if (style === "double") {
		const s = STYLES.double;
		return (
			<span className={`relative inline-block font-semibold whitespace-nowrap text-white ${className}`} style={wrapperStyle}>
				<span
					className={`absolute -z-0 ${color} opacity-40`}
					style={{ top: s.top, bottom: s.bottom, left: s.left, right: s.right, transform: "skewX(-4deg) rotate(1deg)" }}
				/>
				<span
					className={`absolute -z-0 ${color} opacity-50`}
					style={{ top: s.top, bottom: s.bottom, left: s.left, right: s.right, transform: s.transform }}
				/>
				<span className="relative z-10">{children}</span>
			</span>
		);
	}

	// Default: filled highlight behind the text (marker / rough / bold / scribble / thin)
	const s = STYLES[style];
	return (
		<span className={`relative inline-block font-semibold whitespace-nowrap text-white ${className}`} style={wrapperStyle}>
			<span
				className={`absolute -z-0 ${color} ${s.opacity}`}
				style={{
					top: s.top,
					bottom: s.bottom,
					left: s.left,
					right: s.right,
					transform: s.transform
				}}
			/>
			<span className="relative z-10">{children}</span>
		</span>
	);
}
