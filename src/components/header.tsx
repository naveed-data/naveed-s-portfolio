"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { nav, product, profile } from "@/lib/data";
import type { SectionKey } from "@/lib/sections";
import { ThemeToggle } from "./theme-toggle";

export function Header({ onNavigate }: { onNavigate: (key: SectionKey) => void }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const select = (item: (typeof nav)[number]) => {
    onNavigate(item.href.slice(1) as SectionKey);
    setOpen(false);
  };

  return (
    <header className="sticky top-3 z-50 w-full px-4 sm:top-4">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border border-zinc-200/70 bg-white/70 px-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-zinc-950/60">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2"
          aria-label="Scroll to top"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-white dark:text-black">
            {profile.initials}
          </span>
          <span className="text-sm font-bold tracking-wide text-zinc-950 dark:text-white">{product.name}</span>
        </button>

        <nav
          className="relative hidden items-center gap-0.5 md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {nav.map((item) => (
            <button
              key={item.href}
              type="button"
              onMouseEnter={() => setHovered(item.href)}
              onClick={() => select(item)}
              className="relative rounded-full px-3.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            >
              {hovered === item.href && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-zinc-100 dark:bg-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {item.label}
            </button>
          ))}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered("github")}
            className="relative rounded-full px-3.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          >
            {hovered === "github" && (
              <motion.span
                layoutId="nav-hover-pill"
                className="absolute inset-0 -z-10 rounded-full bg-zinc-100 dark:bg-white/10"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/resume"
            className="hidden items-center gap-1.5 rounded-full border border-zinc-200/80 px-3.5 py-1.5 text-sm font-medium text-zinc-600 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/20 dark:hover:bg-white/5 lg:inline-flex"
          >
            <Download className="h-3.5 w-3.5" />
            Resume
          </Link>
          <ThemeToggle />
          <motion.button
            type="button"
            onClick={() => onNavigate("contact")}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="btn-gradient-nova hidden rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] sm:inline-flex"
          >
            Get in touch
          </motion.button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="mx-auto mt-2 flex max-w-4xl flex-col gap-1 rounded-3xl border border-zinc-200/70 bg-white/90 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90 md:hidden"
          >
            {nav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => select(item)}
                className="rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10"
              >
                {item.label}
              </button>
            ))}
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10"
            >
              GitHub
            </a>
            <Link
              href="/resume"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10"
            >
              Download Resume
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
