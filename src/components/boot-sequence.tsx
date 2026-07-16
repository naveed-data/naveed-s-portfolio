"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { product } from "@/lib/data";

const LINES = [
  `Initializing ${product.name}...`,
  "Loading AI Core...",
  "Connecting Knowledge Base...",
  "Loading Engineering Projects...",
  "Loading GitHub Intelligence...",
  "Synchronizing Memory...",
  "Activating Supervisor Agent...",
  "Preparing Multi-Agent Network...",
  `${product.name} Ready.`,
];

const LINE_INTERVAL_MS = 320;
const HOLD_MS = 500;
const FADE_MS = 500;

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [fading, setFading] = useState(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const t = setTimeout(() => onDoneRef.current(), 0);
      return () => clearTimeout(t);
    }

    const timeouts = LINES.map((_, i) => setTimeout(() => setVisibleCount(i + 1), i * LINE_INTERVAL_MS));
    const fadeTimeout = setTimeout(() => setFading(true), LINES.length * LINE_INTERVAL_MS + HOLD_MS);
    const doneTimeout = setTimeout(
      () => onDoneRef.current(),
      LINES.length * LINE_INTERVAL_MS + HOLD_MS + FADE_MS
    );

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(fadeTimeout);
      clearTimeout(doneTimeout);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      aria-hidden
    >
      <div className="w-full max-w-sm px-6 font-mono text-sm">
        <p className="mb-4 text-zinc-500">{product.name} v1.0</p>
        {LINES.slice(0, visibleCount).map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-zinc-300"
          >
            <span className="text-emerald-500">{"> "}</span>
            {line}
            {i === LINES.length - 1 && (
              <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-emerald-500" />
            )}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
