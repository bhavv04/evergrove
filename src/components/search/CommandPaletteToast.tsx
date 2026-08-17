"use client";

import { motion, AnimatePresence } from "framer-motion";

export function CommandPaletteToast({ toast }: { toast: string | null }) {
	return (
		<AnimatePresence>
			{toast && (
				<motion.div
					initial={{ opacity: 0, y: 16, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 16, scale: 0.95 }}
					transition={{ type: "spring", stiffness: 400, damping: 28 }}
					className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-xl border border-white/10 bg-stone-900 px-4 py-2.5 text-sm text-white shadow-2xl"
				>
					{toast}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
