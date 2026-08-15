"use client";
import { FaReact, FaJsSquare, FaFigma, FaDocker, FaLinux, FaJava, FaPython, FaAws, FaGitAlt } from "react-icons/fa";
import {
	SiSupabase,
	SiTailwindcss,
	SiExpress,
	SiRedis,
	SiAppwrite,
	SiClerk,
	SiPostgresql,
	SiVite,
	SiSpringboot,
	SiNginx,
	SiNextdotjs,
	SiSqlite,
	SiRust,
	SiFirebase,
	SiPytorch
} from "react-icons/si";

import { IoLogoVercel } from "react-icons/io5";
import { FaGolang } from "react-icons/fa6";
import { DiMongodb } from "react-icons/di";

const skills = [
	{ name: "React.js", icon: <FaReact className="text-2xl text-cyan-400" /> },
	{ name: "Javascript", icon: <FaJsSquare className="text-2xl text-yellow-300" />, badgeClass: "bg-yellow-300 text-black" },
	{ name: "MongoDB", icon: <DiMongodb className="text-2xl text-green-500" /> },
	{ name: "Supabase", icon: <SiSupabase className="text-2xl text-green-400" /> },
	{ name: "Figma", icon: <FaFigma className="text-2xl text-zinc-100" /> },
	{ name: "Docker", icon: <FaDocker className="text-2xl text-blue-400" /> },
	{ name: "Clerk", icon: <SiClerk className="text-2xl text-purple-400" /> },
	{ name: "Express", icon: <SiExpress className="text-2xl text-green-500" /> },
	{ name: "TailwindCSS", icon: <SiTailwindcss className="text-2xl text-cyan-300" /> },
	{ name: "Redis", icon: <SiRedis className="text-2xl text-red-500" />, badgeClass: "bg-zinc-800 text-red-400" },
	{ name: "PyTorch", icon: <SiPytorch className="text-2xl text-orange-400" /> },
	{ name: "Go", icon: <FaGolang className="text-2xl text-blue-500" /> },
	{ name: "Vercel", icon: <IoLogoVercel className="text-2xl text-white" /> },
	{ name: "Linux", icon: <FaLinux className="text-2xl text-zinc-100" /> },
	{ name: "Appwrite", icon: <SiAppwrite className="text-2xl text-pink-400" /> },
	{ name: "Firebase", icon: <SiFirebase className="text-2xl text-yellow-400" /> },
	{ name: "PostgreSQL", icon: <SiPostgresql className="text-2xl text-blue-300" /> },
	{ name: "Vite", icon: <SiVite className="text-2xl text-purple-300" /> },
	{ name: "Spring Boot", icon: <SiSpringboot className="text-2xl text-green-400" /> },
	{ name: "Nginx", icon: <SiNginx className="text-2xl text-green-500" /> },
	{ name: "Next.js", icon: <SiNextdotjs className="text-2xl text-zinc-100" /> },
	{ name: "SQLite", icon: <SiSqlite className="text-2xl text-blue-400" /> },
	{ name: "Rust", icon: <SiRust className="text-2xl text-orange-400" /> },
	{ name: "Python", icon: <FaPython className="text-2xl text-yellow-400" /> },
	{ name: "Java", icon: <FaJava className="text-2xl text-red-400" /> },
	{ name: "AWS", icon: <FaAws className="text-2xl text-yellow-300" /> },
	{ name: "Git", icon: <FaGitAlt className="text-2xl text-orange-400" /> }
];

const badgeBase = "flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-800/80 px-4 py-3 text-base text-zinc-100 shadow-xs";

function SkillRow({ items, rowKey, animation }: { items: typeof skills; rowKey: string; animation: string }) {
	return (
		<div className={`skills-carousel-track ${animation} pause-on-hover`}>
			{items.map((skill, idx) => (
				<span key={skill.name + rowKey + idx} className={`${badgeBase} ${skill.badgeClass ?? ""}`}>
					{skill.icon}
					{skill.name}
				</span>
			))}
		</div>
	);
}

export default function Skills() {
	const carouselSkills = [...skills, ...skills];
	const reversedSkills = [...carouselSkills].reverse();

	return (
		<section id="skills" className="mx-auto max-w-160 py-8">
			<div className="slide-in-up space-y-4">
				<div className="skills-carousel-outer fade-in-up" style={{ "--delay-index": 8 } as React.CSSProperties}>
					<SkillRow items={carouselSkills} rowKey="row1" animation="animate-skills-carousel" />
				</div>
				<div className="skills-carousel-outer fade-in-up" style={{ "--delay-index": 9 } as React.CSSProperties}>
					<SkillRow items={carouselSkills} rowKey="row2" animation="animate-skills-carousel-reverse" />
				</div>
				<div className="skills-carousel-outer fade-in-up" style={{ "--delay-index": 10 } as React.CSSProperties}>
					<SkillRow items={reversedSkills} rowKey="row3" animation="animate-skills-carousel" />
				</div>
			</div>
		</section>
	);
}
