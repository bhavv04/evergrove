"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { OutputLine } from "@/app/about/terminal/model";
import { executeCommand } from "@/app/about/terminal/commands";
import { X, ChevronUp } from "lucide-react";
import Signature from "@/components/common/Signature";

function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia(query);
		setMatches(mq.matches);
		const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [query]);
	return matches;
}

function OutputBlock({ line }: { line: OutputLine }) {
	const base = "terminal-line-enter wrap-break-word leading-relaxed flex items-start gap-2";
	if (line.type === "command") return <div className={base} dangerouslySetInnerHTML={{ __html: line.content }} />;
	if (line.type === "error")
		return (
			<div className={`${base} text-red-500`}>
				<span className="text-red-700 select-none">▸</span>
				<span dangerouslySetInnerHTML={{ __html: line.content }} />
			</div>
		);
	return (
		<div className={`${base} text-emerald-700`}>
			<span className="text-stone-600 select-none">▸</span>
			<span className="flex-1" dangerouslySetInnerHTML={{ __html: line.content }} />
		</div>
	);
}

const Terminal: React.FC = () => {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [input, setInput] = useState("");
	const [output, setOutput] = useState<OutputLine[]>([]);
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [showButtons, setShowButtons] = useState(false);
	const outputRef = useRef<HTMLDivElement>(null);
	const inputDivRef = useRef<HTMLDivElement>(null);
	const mobileInputRef = useRef<HTMLInputElement>(null);

	const processResultAndAppend = useCallback(
		(cmd: string, result: string) => {
			if (result === "CLEAR_COMMAND") {
				setOutput([]);
				setCommandHistory([]);
				setHistoryIndex(-1);
				setInput("");
				if (inputDivRef.current) inputDivRef.current.textContent = "";
				return;
			}
			if (result.startsWith("REDIRECT_TO_")) {
				const route = result.replace("REDIRECT_TO_", "");
				if (route.endsWith("_blank")) window.open(route.replace("_blank", ""), "_blank");
				else router.push(route);
				return;
			}
			const cmdLine: OutputLine = {
				id: Date.now().toString(),
				content: `<span class="">$</span> <span class="text-stone-300">${cmd}</span>`,
				type: "command"
			};
			const next = [...output, cmdLine];
			if (result) next.push({ id: (Date.now() + 1).toString(), content: result, type: "output" });
			setOutput(next);
			setCommandHistory((prev) => [cmd, ...prev.slice(0, 49)]);
		},
		[output, router]
	);

	const handleQuickCommand = useCallback(
		(cmd: string) => {
			processResultAndAppend(cmd, executeCommand(cmd));
		},
		[processResultAndAppend]
	);

	useEffect(() => {
		if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
	}, [output]);

	useEffect(() => {
		(isMobile ? mobileInputRef : inputDivRef).current?.focus({ preventScroll: true });
	}, [isMobile]);

	useEffect(() => {
		const t = setTimeout(() => setShowButtons(true), 3000);
		return () => clearTimeout(t);
	}, []);

	const handleSubmit = useCallback(
		(e?: React.KeyboardEvent | React.FormEvent) => {
			e?.preventDefault();
			const cmd = input.trim();
			if (!cmd) return;
			processResultAndAppend(cmd, executeCommand(cmd));
			setHistoryIndex(-1);
			setInput("");
			if (inputDivRef.current) inputDivRef.current.textContent = "";
		},
		[input, processResultAndAppend]
	);

	const moveCaretToEnd = () =>
		requestAnimationFrame(() => {
			const el = inputDivRef.current;
			if (!el) return;
			const range = document.createRange();
			const sel = window.getSelection();
			range.selectNodeContents(el);
			range.collapse(false);
			sel?.removeAllRanges();
			sel?.addRange(range);
		});

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "ArrowUp") {
				e.preventDefault();
				const next = Math.min(historyIndex + 1, commandHistory.length - 1);
				if (commandHistory[next] !== undefined) {
					setHistoryIndex(next);
					setInput(commandHistory[next]);
					if (inputDivRef.current) {
						inputDivRef.current.textContent = commandHistory[next];
						moveCaretToEnd();
					}
				}
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				if (historyIndex <= 0) {
					setHistoryIndex(-1);
					setInput("");
					if (inputDivRef.current) inputDivRef.current.textContent = "";
				} else {
					const next = historyIndex - 1;
					setHistoryIndex(next);
					setInput(commandHistory[next] ?? "");
					if (inputDivRef.current) {
						inputDivRef.current.textContent = commandHistory[next] ?? "";
						moveCaretToEnd();
					}
				}
			}
		},
		[commandHistory, historyIndex]
	);

	const cycleMobileHistory = useCallback(() => {
		const next = Math.min(historyIndex + 1, commandHistory.length - 1);
		if (commandHistory[next] !== undefined) {
			setHistoryIndex(next);
			setInput(commandHistory[next]);
		}
	}, [commandHistory, historyIndex]);

	return (
		<div
			className="scale-in relative flex h-[70vh] flex-col overflow-hidden rounded-2xl bg-stone-900 text-xs shadow-lg shadow-black/40"
			style={{ "--delay-index": 2 } as React.CSSProperties}
			onClick={() => (isMobile ? mobileInputRef : inputDivRef).current?.focus()}
		>
			<div className="terminal-scanlines" aria-hidden />

			{/* Title bar */}
			<div className="relative z-10 grid grid-cols-3 items-center bg-stone-950 px-4 py-3">
				<div className="terminal-dot-group flex items-center gap-2">
					<span className="dot-red h-3 w-3 rounded-full bg-red-500 transition-shadow duration-200" />
					<span className="dot-yellow h-3 w-3 rounded-full bg-yellow-500 transition-shadow duration-200" />
					<span className="dot-green h-3 w-3 rounded-full bg-green-500 transition-shadow duration-200" />
				</div>
				<span className="text-center text-xs text-stone-600">bhav~default</span>
				<span className="text-right text-stone-600">
					<X className="inline-block h-4 w-4 rounded hover:bg-stone-700/50" onClick={() => router.push("/about")} />
				</span>
			</div>

			{/* Body */}
			<div ref={outputRef} className="relative z-10 flex-1 scrollbar-none overflow-y-auto p-6 text-stone-500">
				<div className="mb-4">
					<Signature />
				</div>
				{showButtons && (
					<div className="fade-in-up mb-6 flex flex-wrap justify-center gap-2">
						{["help", "about", "books", "hobbies", "status", "neofetch", "sudo", "matrix"].map((cmd) => (
							<button
								key={cmd}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => handleQuickCommand(cmd)}
								className="min-h-[44px] rounded-md bg-white/5 px-4 py-2 text-stone-400 backdrop-blur-xs transition-all duration-200 hover:bg-white/10 hover:text-stone-100 active:scale-95 sm:min-h-0"
							>
								{cmd}
							</button>
						))}
					</div>
				)}
				<div className="space-y-2">
					{output.map((line) => (
						<OutputBlock key={line.id} line={line} />
					))}
				</div>
			</div>

			{/* Footer */}
			<div
				className="relative z-10 border-t border-stone-800 bg-stone-950 px-4 py-2"
				style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
			>
				<div className="flex items-center gap-2">
					<span className="text-stone-600 select-none">{`> `}</span>
					<div className="relative flex flex-1 items-center">
						{!input && <span className="pointer-events-none absolute text-stone-600 select-none">type a command...</span>}
						{isMobile ? (
							<input
								ref={mobileInputRef}
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
								className="w-full border-none bg-transparent text-base text-stone-300 focus:ring-0 focus:outline-hidden sm:text-xs"
								style={{ fontSize: "16px" }}
								autoComplete="off"
								autoCorrect="off"
								autoCapitalize="off"
								spellCheck={false}
							/>
						) : (
							<div
								ref={inputDivRef}
								contentEditable
								suppressContentEditableWarning
								onInput={(e) => setInput(e.currentTarget.textContent ?? "")}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleSubmit(e);
									} else handleKeyDown(e);
								}}
								className="w-full flex-1 text-stone-300 focus:ring-0 focus:outline-hidden"
								style={{ fontSize: "16px" }}
							/>
						)}
					</div>
					{isMobile ? (
						<div className="flex items-center gap-1">
							<button
								onClick={cycleMobileHistory}
								disabled={commandHistory.length === 0}
								className="flex h-8 w-8 items-center justify-center rounded text-stone-500 hover:bg-stone-800 disabled:opacity-30"
								aria-label="Previous command"
								style={{ fontSize: "16px" }}
							>
								<ChevronUp className="h-4 w-4" />
							</button>
							<button onClick={() => handleSubmit()} className="rounded bg-stone-800 px-3 py-1 text-xs hover:bg-white hover:text-black">
								run
							</button>
						</div>
					) : (
						<span className="hidden text-xs text-stone-600 select-none sm:inline"> enter to run · clear to reset</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default Terminal;
