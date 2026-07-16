"use client";

import { motion } from "framer-motion";
import { highlights } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Highlights({ size = "md" }: { size?: "md" | "sm" }) {
  const sm = size === "sm";
  return (
    <div
      className={cn(
        "relative z-10 mx-auto grid w-full grid-cols-2 sm:grid-cols-4",
        sm ? "max-w-2xl gap-2.5" : "max-w-3xl gap-4 px-6"
      )}
    >
      {highlights.map((h, i) => (
        <motion.div
          key={h.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 24 }}
          className={cn(
            "rounded-2xl border border-zinc-200/70 bg-white/60 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/50",
            sm ? "p-2.5" : "p-4"
          )}
        >
          <p className={cn("text-gradient-nova font-extrabold", sm ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl")}>
            {h.value}
          </p>
          <p className={cn("mt-1 font-medium text-zinc-500 dark:text-zinc-500", sm ? "text-[10px]" : "text-xs")}>
            {h.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
