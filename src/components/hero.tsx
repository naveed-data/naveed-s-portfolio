"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AiOrb } from "@/components/ai-orb";
import { AiStatusPanel } from "@/components/ai-status-panel";
import { ChatAgent, type ChatAgentHandle } from "@/components/chat-agent";
import { NeuralBackground } from "@/components/neural-background";
import { product } from "@/lib/data";
import type { SectionKey } from "@/lib/sections";

const TAGLINE_CHARS = Array.from(product.tagline);
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero({ onNavigate }: { onNavigate: (key: SectionKey) => void }) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const orbWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<ChatAgentHandle>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId = 0;
    const onMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        if (panelRef.current) {
          panelRef.current.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
        }
        if (orbWrapRef.current) {
          orbWrapRef.current.style.transform = `translate(${x * 18}px, ${y * 18}px)`;
        }
        if (glowRef.current && sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          glowRef.current.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
        }
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "translate(0, 0)";
  };

  const spawnRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement("span");
    span.style.position = "absolute";
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    span.style.width = `${size}px`;
    span.style.height = `${size}px`;
    span.style.borderRadius = "9999px";
    span.style.background = "rgba(255,255,255,0.5)";
    span.style.pointerEvents = "none";
    span.className = "animate-ripple";
    el.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  };

  const d = (base: number) => (prefersReducedMotion ? 0 : base);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden px-6 py-16 sm:py-20"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: d(1.2) }}
      >
        <NeuralBackground />
        <div className="absolute inset-0 bg-grid-fade" />
      </motion.div>

      {/* cinematic lighting */}
      <div
        aria-hidden
        className="animate-breathe pointer-events-none absolute left-1/2 top-16 z-0 h-72 w-[32rem] -translate-x-1/2 rounded-full bg-blue-500/25 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -left-24 top-10 z-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-drift-reverse pointer-events-none absolute -right-16 bottom-10 z-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-orb-pulse pointer-events-none absolute bottom-0 left-1/2 z-0 h-64 w-[40rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-600/25 blur-3xl"
      />

      {/* cursor glow */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/10 blur-3xl will-change-transform dark:bg-violet-300/10"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:justify-center lg:gap-16">
        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: prefersReducedMotion ? 0 : [0, -8, 0] }}
          transition={{
            opacity: { duration: d(0.8), ease: EASE },
            scale: { duration: d(0.8), ease: EASE },
            y: prefersReducedMotion
              ? { duration: 0 }
              : { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
          }}
        >
          <div ref={panelRef} style={{ transition: "transform 300ms ease-out" }} className="group relative">
            <div className="relative overflow-hidden rounded-[32px] border border-white/30 bg-white/60 p-10 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset,0_8px_40px_-8px_rgba(139,92,246,0.25),0_30px_80px_-20px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_8px_60px_-4px_rgba(139,92,246,0.4),0_40px_100px_-20px_rgba(0,0,0,0.3)] dark:border-white/10 dark:bg-zinc-950/50 sm:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/20"
              />

              <motion.div
                className="relative inline-block"
                animate={{ scale: prefersReducedMotion ? 1 : [1, 1.02, 1] }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }
              >
                <motion.h1
                  className="text-gradient-nova relative text-4xl font-extrabold tracking-tight sm:text-5xl"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: d(0.7), ease: EASE, delay: d(0.15) }}
                >
                  {product.greeting}
                </motion.h1>
                <span
                  aria-hidden
                  className="animate-title-shimmer pointer-events-none absolute inset-0 bg-[length:60%_100%] bg-gradient-to-r from-transparent via-white/70 to-transparent bg-clip-text bg-no-repeat text-4xl font-extrabold tracking-tight text-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:text-5xl"
                >
                  {product.greeting}
                </span>
              </motion.div>

              <motion.p
                className="mt-4 min-h-[2rem] text-xl font-semibold text-zinc-700/90 dark:text-zinc-300/90 sm:text-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: d(0.6), ease: EASE, delay: d(0.9) }}
              >
                {product.category}
              </motion.p>

              <motion.p
                className="animate-float-tiny mt-2 flex flex-wrap justify-center text-sm font-medium text-violet-600 drop-shadow-[0_0_14px_rgba(139,92,246,0.5)] dark:text-violet-400"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: d(0.035), delayChildren: d(1.35) } },
                }}
              >
                {TAGLINE_CHARS.map((char, i) => (
                  <motion.span
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: d(0.25) }}
                  >
                    {char === " " ? " " : char}
                  </motion.span>
                ))}
              </motion.p>

              <motion.p
                className="mx-auto mt-5 max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: d(0.6), ease: EASE, delay: d(1.9) }}
              >
                {product.description}
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap items-center justify-center gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: d(0.6), ease: EASE, delay: d(2.3) }}
              >
                <motion.button
                  type="button"
                  onClick={() => chatRef.current?.startWithIntro()}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  onPointerDown={spawnRipple}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  style={{ transition: "transform 200ms ease-out" }}
                  className="btn-gradient-nova relative isolate overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(139,92,246,0.75)]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/25 to-transparent"
                  />
                  🚀 Start Conversation
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => onNavigate("projects")}
                  onPointerDown={spawnRipple}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="relative isolate overflow-hidden rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-zinc-700 backdrop-blur-md transition-colors hover:bg-white/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                >
                  📂 Explore Projects
                </motion.button>
              </motion.div>

              <div className="mt-8 w-full">
                <ChatAgent ref={chatRef} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: prefersReducedMotion ? 0 : [0, -8, 0] }}
          transition={{
            opacity: { duration: d(0.8), ease: EASE, delay: d(0.2) },
            scale: { duration: d(0.8), ease: EASE, delay: d(0.2) },
            y: prefersReducedMotion
              ? { duration: 0 }
              : { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
        >
          <div ref={orbWrapRef} style={{ transition: "transform 300ms ease-out" }}>
            <AiOrb />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mt-2 flex w-full justify-center px-4">
        <AiStatusPanel />
      </div>

      <div
        aria-hidden
        className="pointer-events-none relative z-0 mt-16 h-16 w-full select-none overflow-hidden sm:h-24"
      >
        <div className="absolute inset-x-0 top-0 whitespace-nowrap text-center text-[clamp(3rem,14vw,10rem)] font-black leading-none tracking-tight text-zinc-950/[0.04] dark:text-white/[0.05]">
          {product.name}
        </div>
      </div>
    </section>
  );
}
