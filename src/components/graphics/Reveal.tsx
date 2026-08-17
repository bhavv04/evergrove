"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RevealProps {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
	const ref = useScrollReveal();
	return (
		<div ref={ref} className={`opacity-0 ${className}`} style={{ "--delay-index": delay } as React.CSSProperties}>
			{children}
		</div>
	);
}
