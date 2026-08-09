"use client";

import { useEffect, useRef, useState } from "react";

const BIRTH_DATE = new Date("2004-01-03T00:00:00Z");
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export function useLiveAge(decimals = 10) {
	const [age, setAge] = useState(() => ((Date.now() - BIRTH_DATE.getTime()) / MS_PER_YEAR).toFixed(decimals));
	const frameRef = useRef<number>(0);

	useEffect(() => {
		const tick = () => {
			setAge(((Date.now() - BIRTH_DATE.getTime()) / MS_PER_YEAR).toFixed(decimals));
			frameRef.current = requestAnimationFrame(tick);
		};
		frameRef.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frameRef.current);
	}, [decimals]);

	return age;
}
