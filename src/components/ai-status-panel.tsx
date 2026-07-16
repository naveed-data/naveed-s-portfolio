"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Database, GitBranch, Network } from "lucide-react";
import { agentRoster, profile } from "@/lib/data";

const ITEMS = [
  { icon: BrainCircuit, label: "Supervisor Ready" },
  { icon: Database, label: "Knowledge Base Connected" },
  { icon: Network, label: `${agentRoster.length} Agents Ready` },
  { icon: GitBranch, label: "GitHub Linked", href: profile.github },
];

export function AiStatusPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 26 }}
      className="relative w-full max-w-3xl overflow-hidden rounded-full border border-white/30 bg-white/60 px-5 py-3 shadow-[0_8px_30px_-12px_rgba(139,92,246,0.3)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/50"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent motion-safe:animate-[shimmer_4s_ease-in-out_infinite] dark:via-white/10"
      />
      <div className="relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          AI Online
        </span>
        {ITEMS.map((item) =>
          item.href ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-zinc-950 dark:hover:text-white"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </a>
          ) : (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </span>
          )
        )}
      </div>
    </motion.div>
  );
}
