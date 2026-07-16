"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SECTION_COMPONENTS, SECTION_TITLES, type SectionKey } from "@/lib/sections";

export function SectionPanel({
  active,
  onClose,
}: {
  active: SectionKey | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, onClose]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-10 backdrop-blur-sm sm:items-center"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={SECTION_TITLES[active]}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/30 bg-white/80 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/70"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/20 bg-white/70 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/60">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                {SECTION_TITLES[active]}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-8">
              {(() => {
                const Content = SECTION_COMPONENTS[active];
                return <Content />;
              })()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
