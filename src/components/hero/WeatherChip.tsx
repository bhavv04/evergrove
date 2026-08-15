"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WeatherData {
	temp: number;
	condition: string;
}

const WMO_CODES: Record<number, string> = {
	0: "Clear",
	1: "Mostly clear",
	2: "Partly cloudy",
	3: "Overcast",
	45: "Foggy",
	48: "Foggy",
	51: "Drizzle",
	53: "Drizzle",
	55: "Drizzle",
	61: "Rain",
	63: "Rain",
	65: "Heavy rain",
	71: "Snow",
	73: "Snow",
	75: "Heavy snow",
	80: "Showers",
	81: "Showers",
	82: "Heavy showers",
	95: "Thunderstorm",
	96: "Thunderstorm",
	99: "Thunderstorm"
};

export function WeatherChip({ className }: { className?: string }) {
	const [weather, setWeather] = useState<WeatherData | null>(null);

	useEffect(() => {
		fetch(
			"https://api.open-meteo.com/v1/forecast?latitude=43.7001&longitude=-79.4163&current=temperature_2m,weathercode&temperature_unit=celsius&timezone=America%2FToronto"
		)
			.then((r) => r.json())
			.then((data) => {
				const temp = Math.round(data.current.temperature_2m);
				const code = data.current.weathercode;
				setWeather({
					temp,
					condition: WMO_CODES[code] ?? "Unknown"
				});
			})
			.catch(() => setWeather(null));
	}, []);

	return (
		<div className={cn("flex flex-col gap-px", className)}>
			<span className="text-[10px] text-stone-400">weather</span>
			<span className="text-[13px] text-stone-100">{weather ? `${weather.temp}°C` : "-"}</span>
		</div>
	);
}
