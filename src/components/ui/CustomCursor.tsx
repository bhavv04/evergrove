"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useAnimationFrame } from "framer-motion";

const TAU = Math.PI * 2;

function angleDelta(from: number, to: number) {
	let delta = (to - from) % TAU;
	if (delta > Math.PI) delta -= TAU;
	if (delta < -Math.PI) delta += TAU;
	return delta;
}

const FILL_IDLE = "#000000";
const FILL_ACTIVE = "#5b9bff";

export function CustomCursor() {
	const [isTouch, setIsTouch] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const [isPressed, setIsPressed] = useState(false);

	const targetX = useMotionValue(0);
	const targetY = useMotionValue(0);
	const springConfig = { damping: 26, stiffness: 300, mass: 0.5 };
	const x = useSpring(targetX, springConfig);
	const y = useSpring(targetY, springConfig);

	const rotate = useMotionValue(0);
	const scaleY = useMotionValue(1); // bank only

	const state = useRef({
		lastX: 0,
		lastY: 0,
		heading: 0,
		headingKnown: false,
		prevHeading: 0,
		roll: 0,
		lastTime: 0
	});

	useEffect(() => {
		const hasTouch = window.matchMedia("(pointer: coarse)").matches;
		setIsTouch(hasTouch);
		if (hasTouch) return;

		const move = (e: MouseEvent) => {
			targetX.set(e.clientX);
			targetY.set(e.clientY);
			if (!isVisible) setIsVisible(true);
		};

		const over = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			setIsHovering(!!target.closest("a, button, [role='button'], select, summary, label, .cursor-hover, .cursor-pointer"));
		};

		const down = (e: MouseEvent) => {
			if (e.button === 0) setIsPressed(true);
		};
		const up = () => setIsPressed(false);
		const leave = () => setIsVisible(false);

		window.addEventListener("mousemove", move);
		window.addEventListener("mouseover", over);
		window.addEventListener("mousedown", down);
		window.addEventListener("mouseup", up);
		window.addEventListener("blur", up);
		document.addEventListener("mouseleave", leave);

		return () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseover", over);
			window.removeEventListener("mousedown", down);
			window.removeEventListener("mouseup", up);
			window.removeEventListener("blur", up);
			document.removeEventListener("mouseleave", leave);
		};
	}, [targetX, targetY, isVisible]);

	useAnimationFrame((time) => {
		if (isTouch) return;
		const s = state.current;
		if (!s.lastTime) s.lastTime = time;
		const dt = Math.min((time - s.lastTime) / 1000, 0.05) || 0.016;
		s.lastTime = time;

		const curX = x.get();
		const curY = y.get();
		const vx = (curX - s.lastX) / dt;
		const vy = (curY - s.lastY) / dt;
		s.lastX = curX;
		s.lastY = curY;

		const speed = Math.hypot(vx, vy);

		if (speed > 8) {
			const desired = Math.atan2(vy, vx);
			if (!s.headingKnown) {
				s.heading = desired;
				s.prevHeading = desired;
				s.headingKnown = true;
			} else {
				const headingFactor = 1 - Math.exp(-dt * 16);
				s.heading += angleDelta(s.heading, desired) * headingFactor;
			}
		}

		const turnRate = angleDelta(s.prevHeading, s.heading) / dt;
		s.prevHeading = s.heading;
		const targetRollDeg = Math.max(-30, Math.min(30, ((turnRate * 180) / Math.PI) * -0.16));
		const rollFactor = 1 - Math.exp(-dt * 9);
		s.roll += (targetRollDeg - s.roll) * rollFactor;

		const bank = Math.cos((s.roll * Math.PI) / 180);
		rotate.set((s.heading * 180) / Math.PI);
		scaleY.set(bank);
	});

	if (isTouch) return null;

	const active = isHovering || isPressed;

	return (
		<motion.div
			className="pointer-events-none fixed top-0 left-0 z-[9999]"
			style={{ x, y, filter: "drop-shadow(0 2px 4px rgba(15, 23, 42, 0.25))" }}
			animate={{ opacity: isVisible ? 1 : 0 }}
			transition={{ duration: 0.18, ease: "easeOut" }}
		>
			<motion.svg viewBox="-19 -15 38 30" width="38" height="30" style={{ x: -19, y: -15, rotate, scaleY, overflow: "visible" }}>
				<motion.polygon
					points="17,0 -17,-13 -10,0"
					stroke="#ffffff"
					strokeWidth={1.5}
					strokeLinejoin="round"
					style={{ paintOrder: "stroke fill" }}
					animate={{ fill: active ? FILL_ACTIVE : FILL_IDLE }}
					transition={{ duration: 0.2 }}
				/>
				<motion.polygon
					points="17,0 -10,0 -17,13"
					stroke="#ffffff"
					strokeWidth={1.5}
					strokeLinejoin="round"
					style={{ paintOrder: "stroke fill" }}
					animate={{ fill: active ? FILL_ACTIVE : FILL_IDLE }}
					transition={{ duration: 0.2 }}
				/>
			</motion.svg>
		</motion.div>
	);
}
