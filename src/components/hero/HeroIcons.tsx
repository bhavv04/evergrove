"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WeatherChip } from "@/components/hero/WeatherChip";

export function HeroIcons() {
	const [currentTime, setCurrentTime] = useState<string>("");
	const [currentDate, setCurrentDate] = useState<string>("");

	useEffect(() => {
		const updateDateTime = () => {
			const now = new Date();

			const timeString = now.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				timeZone: "America/Toronto"
			});

			const dateString = now.toLocaleDateString("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
				timeZone: "America/Toronto"
			});

			setCurrentTime(timeString);
			setCurrentDate(dateString);
		};

		updateDateTime();
		const interval = setInterval(updateDateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-wrap items-start gap-4">
			<HeroChip label="location" value="Toronto, ON" />
			<HeroChip label="date" value={currentDate} />
			<HeroChip label="time" value={currentTime} />
			<WeatherChip />
		</div>
	);
}

interface HeroChipProps {
	label: string;
	value: string;
	className?: string;
}

export function HeroChip({ label, value, className }: HeroChipProps) {
	return (
		<div className={cn("flex flex-col gap-px", className)}>
			<span className="text-[10px] text-stone-400">{label}</span>
			<span className="text-[13px] text-stone-100">{value}</span>
		</div>
	);
}
