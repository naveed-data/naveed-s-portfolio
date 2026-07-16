"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { product, profile, projects, skillGroups } from "@/lib/data";

type Line = { type: "input" | "output"; text: string };

const HELP_TEXT = `Available commands:
  help          Show this help message
  projects      List projects
  skills        List skill categories
  contact       Show contact info
  architecture  Describe how ${product.name} is built
  resume        Open the resume page
  clear         Clear the terminal`;

function runCommand(raw: string): { output: string; action?: () => void } {
  const cmd = raw.trim().toLowerCase();
  if (cmd === "") return { output: "" };
  if (cmd === "help") return { output: HELP_TEXT };
  if (cmd === "projects") {
    return { output: projects.map((p) => `${p.name} — ${p.tagline}`).join("\n") };
  }
  if (cmd === "skills") {
    return { output: skillGroups.map((g) => `${g.title}: ${g.skills.join(", ")}`).join("\n\n") };
  }
  if (cmd === "contact") {
    return {
      output: `Email:    ${profile.email}\nPhone:    ${profile.phone}\nLinkedIn: ${profile.linkedin}\nGitHub:   ${profile.github}`,
    };
  }
  if (cmd === "architecture") {
    return {
      output:
        "User -> API Gateway -> Supervisor Agent -> Sub-Agents -> Groq LLM -> Streamed Response.\nOpen the Architecture panel or ask the AI assistant for the full animated diagram.",
    };
  }
  if (cmd === "resume") {
    return { output: "Opening /resume ...", action: () => window.open("/resume", "_blank") };
  }
  if (cmd === "whoami") {
    return { output: "guest (press ⌘K or Ctrl+K for the Command Palette)" };
  }
  return { output: `command not found: ${cmd}\nType 'help' for a list of commands.` };
}

export function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: `${product.name} terminal. Type 'help' to get started.` },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input;
    setInput("");

    if (cmd.trim().toLowerCase() === "clear") {
      setLines([]);
      return;
    }

    const { output, action } = runCommand(cmd);
    setLines((prev) => [
      ...prev,
      { type: "input", text: cmd },
      ...(output ? [{ type: "output" as const, text: output }] : []),
    ]);
    action?.();
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    });
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
        {open && (
          <motion.div
            key="terminal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[75] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
            role="presentation"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Terminal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-violet-500/10"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                </div>
                <span className="font-mono text-xs text-zinc-500">guest@naviq</span>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={onClose}
                  aria-label="Close terminal"
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
              <div ref={scrollRef} className="h-80 overflow-y-auto p-4 font-mono text-sm text-zinc-300">
                {lines.map((l, i) => (
                  <p key={i} className={cn("whitespace-pre-wrap", l.type === "input" && "text-emerald-400")}>
                    {l.type === "input" ? `guest@naviq:~$ ${l.text}` : l.text}
                  </p>
                ))}
                <form onSubmit={submit} className="mt-1 flex items-center gap-2">
                  <span className="shrink-0 text-emerald-400">guest@naviq:~$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent text-zinc-100 outline-none"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
}
