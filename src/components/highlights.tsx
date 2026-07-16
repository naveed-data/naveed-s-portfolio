"use client";

import { motion } from "framer-motion";
import { highlights } from "@/lib/data";

export function Highlights() {
  return (
    <div className="relative z-10 mx-auto grid w-full max-w-3xl grid-cols-2 gap-4 px-6 sm:grid-cols-4">
      {highlights.map((h, i) => (
        <motion.div
          key={h.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 24 }}
          className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/50"
        >
          <p className="text-gradient-nova text-2xl font-extrabold sm:text-3xl">{h.value}</p>
          <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-500">{h.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
