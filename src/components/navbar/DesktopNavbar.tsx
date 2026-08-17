"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, User, BriefcaseBusiness, Wrench, Microscope, PencilLine, Coffee } from "lucide-react";

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

export function DesktopNavbar({ className }: { className?: string }) {
	const pathname = usePathname();

	return (
		<nav className={cn("fixed top-1/2 right-4 z-50 flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-xl bg-stone-900 px-2 py-2", className)}>
			{navItems.map((item, i) =>
				item === null ? (
					<div key={i} className="my-1 h-px w-6 bg-white/20" aria-hidden="true" />
				) : (
					<NavbarIconButton key={item.href} {...item} isActive={isActivePath(pathname, item.href)} />
				)
			)}
		</nav>
	);
}

function NavbarIconButton({
	href,
	label,
	icon: Icon,
	isActive = false,
	openInNewTab = false,
	useClientSideRouting = false
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
		<div className="group relative flex items-center">
			<Comp
				href={href}
				target={openInNewTab ? "_blank" : "_self"}
				rel={openInNewTab ? "noopener noreferrer" : undefined}
				aria-label={label}
				aria-current={isActive ? "page" : undefined}
				className={cn(
					"relative flex size-10 items-center justify-center rounded-xl transition-colors duration-200",
					"focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 focus-visible:outline-none",
					isActive ? "text-black" : "text-white/35 hover:bg-white/10 hover:text-white"
				)}
			>
				{isActive && (
					<motion.span
						layoutId="navbar-active-pill"
						className="absolute inset-0 rounded-xl bg-white"
						transition={{ type: "spring", stiffness: 400, damping: 32 }}
					/>
				)}
				<Icon size={18} strokeWidth={2} className="relative z-10" />
			</Comp>

			{/* tooltip */}
			<span className="pointer-events-none absolute top-1/2 right-[calc(100%+0.875rem)] translate-x-1 -translate-y-1/2 rounded-xl bg-stone-900 px-2.5 py-1 text-xs tracking-wide whitespace-nowrap text-white/70 opacity-0 backdrop-blur-xs transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
				{label}
				{openInNewTab && " ↗"}
			</span>
		</div>
	);
}
