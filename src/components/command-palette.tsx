"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { nav, profile } from "@/lib/data";
import type { SectionKey } from "@/lib/sections";

type Props = {
  onNavigateSection: (key: SectionKey) => void;
  onOpenChat: () => void;
  onOpenTerminal: () => void;
};

export function CommandPalette({ onNavigateSection, onOpenChat, onOpenTerminal }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const run = (fn: () => void) => {
    fn();
    setOpen(false);
    setQuery("");
  };

  const actions = [
    { id: "chat", label: "Talk to My AI", run: onOpenChat },
    ...nav.map((item) => ({
      id: item.href,
      label: `Go to ${item.label}`,
      run: () => onNavigateSection(item.href.slice(1) as SectionKey),
    })),
    { id: "terminal", label: "Open Terminal", run: onOpenTerminal },
    { id: "github", label: "Open GitHub", run: () => window.open(profile.github, "_blank") },
    {
      id: "theme",
      label: resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },
    { id: "resume", label: "Download Resume", run: () => router.push("/resume") },
    {
      id: "email",
      label: `Copy Email (${profile.email})`,
      run: () => navigator.clipboard.writeText(profile.email),
    },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/30 bg-white/85 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/80"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command..."
              className="w-full border-b border-zinc-200/70 bg-transparent px-4 py-3 text-sm text-zinc-900 outline-none dark:border-white/10 dark:text-white"
            />
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-zinc-400 dark:text-zinc-600">
                  No matching commands
                </p>
              )}
              {filtered.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => run(a.run)}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
