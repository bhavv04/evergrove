"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, User, BriefcaseBusiness, Wrench, Microscope, PencilLine, Coffee } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
	{ href: "/", label: "Home", icon: Home, useClientSideRouting: true },
	{ href: "/about", label: "About", icon: User, useClientSideRouting: true },
	{ href: "/timeline", label: "Experiences & Education", icon: BriefcaseBusiness, useClientSideRouting: true },
	null,
	{ href: "/projects", label: "Projects", icon: Wrench, useClientSideRouting: true },
	{ href: "/research", label: "Research", icon: Microscope, useClientSideRouting: true },
	{ href: "/blog", label: "Blog", icon: PencilLine, useClientSideRouting: true },
	null,
	{ href: "/Bhavdeep_s_Resume.pdf", label: "Resume", icon: Coffee, openInNewTab: true }
] as const;

function isActivePath(pathname: string, href: string) {
	if (href === "/") return pathname === "/";
	return pathname.startsWith(href.split("#")[0]);
}

export function MobileNavbar({ className }: { className?: string }) {
	const pathname = usePathname();
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		let lastScrollY = window.scrollY;

		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			const atBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 10;

			// Show at bottom
			if (atBottom) {
				setVisible(true);
			}
			// Scrolling down
			else if (currentScrollY > lastScrollY && currentScrollY > 50) {
				setVisible(false);
			}
			// Scrolling up
			else if (currentScrollY < lastScrollY) {
				setVisible(true);
			}

			lastScrollY = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			className={cn(
				"fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300",
				visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
			)}
		>
			<nav className={cn("flex items-center gap-1 rounded-lg bg-stone-900 p-1.5", className)}>
				{navItems.map((item, i) =>
					item === null ? (
						<div key={i} className="mx-1 h-6 w-px bg-white/10" aria-hidden="true" />
					) : (
						<NavbarIconButton key={item.href} {...item} isActive={isActivePath(pathname, item.href)} />
					)
				)}
			</nav>
		</div>
	);
}

function NavbarIconButton({
	href,
	label,
	icon: Icon,
	isActive = false,
	openInNewTab = false,
	useClientSideRouting = true
}: {
	href: string;
	label: string;
	icon: React.ElementType;
	isActive?: boolean;
	openInNewTab?: boolean;
	useClientSideRouting?: boolean;
}) {
	const Comp = useClientSideRouting ? Link : "a";

	return (
		<Comp
			href={href}
			target={openInNewTab ? "_blank" : "_self"}
			rel={openInNewTab ? "noopener noreferrer" : undefined}
			aria-label={label}
			aria-current={isActive ? "page" : undefined}
			className={cn(
				"relative flex size-9 items-center justify-center rounded-lg transition-colors duration-200",
				"focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 focus-visible:outline-none",
				isActive ? "text-black" : "text-white/35 hover:bg-white/10 hover:text-white"
			)}
		>
			{isActive && (
				<motion.span
					layoutId="mobile-navbar-active-pill"
					className="absolute inset-0 rounded-lg bg-white"
					transition={{ type: "spring", stiffness: 400, damping: 32 }}
				/>
			)}
			<Icon size={18} strokeWidth={2} className="relative z-10" />
		</Comp>
	);
}
