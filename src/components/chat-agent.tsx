"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Bot, MessageCircle, Trash2, X } from "lucide-react";
import { product, profile } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/markdown";
import { ReasoningTimeline, type TimelineStep } from "@/components/reasoning-timeline";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timeline?: TimelineStep[];
  timelineCollapsed?: boolean;
  elapsedMs?: number;
};

export type ChatAgentHandle = {
  startWithIntro: () => void;
};

const firstName = profile.name.split(" ")[0];

const SUGGESTIONS = [
  "Why should I hire Naveed?",
  "Explain your flagship AI project.",
  "How was NAVIQ built?",
];

const INTRO_TEXT = `Hello.

I'm ${product.name}.

I'm an AI Engineering Operating System built to explain engineering work through conversation rather than static pages.

You can ask me about projects, architecture, AI systems, engineering decisions, or even compare ${firstName} against your job description.

Everything you see here is designed to demonstrate production AI engineering.

Where would you like to begin?`;

const STAGE_META: Record<string, { icon: string; label: string }> = {
  "Understanding Intent": { icon: "🧠", label: "Understanding Intent..." },
  "Memory: Context Loaded": { icon: "💾", label: "Memory Agent — Context Loaded" },
  "Supervisor Agent Activated": { icon: "🤖", label: "Supervisor Agent Activated" },
  "Synthesizing Response": { icon: "📝", label: "Synthesizing Response..." },
};

const TOOL_ICONS: Record<string, string> = {
  get_experience: "📄",
  get_education: "🎓",
  get_projects: "📁",
  get_skills: "🧩",
  get_architecture: "🏗",
  get_contact_info: "📇",
};

// Small pacing delay so genuinely-sequential reasoning steps are perceivable
// rather than flashing by within the same network chunk. Does not touch
// token streaming, which stays instant.
const STEP_REVEAL_DELAY_MS = 180;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Avatar({ role }: { role: "user" | "assistant" }) {
  if (role === "assistant") {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
        <Bot className="h-3.5 w-3.5" />
      </div>
    );
  }
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-semibold text-white dark:bg-white dark:text-black">
      {profile.initials}
    </div>
  );
}

export const ChatAgent = forwardRef<ChatAgentHandle>(function ChatAgent(_props, ref) {
  const prefersReducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [open, setOpen] = useState(false);

  const [heroInput, setHeroInput] = useState("");
  const [composerInput, setComposerInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveElapsed, setLiveElapsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLInputElement>(null);
  const introIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (introIntervalRef.current) clearInterval(introIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    composerRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const updateLastMessage = (updater: (message: ChatMessage) => ChatMessage) => {
    setMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = updater(copy[copy.length - 1]);
      return copy;
    });
  };

  const appendStep = (icon: string, label: string, kind: TimelineStep["kind"]) => {
    updateLastMessage((m) => {
      const prior = (m.timeline ?? []).map((s) => ({ ...s, status: "done" as const }));
      const step: TimelineStep = { id: `${prior.length}-${label}`, icon, label, kind, status: "active" };
      return { ...m, timeline: [...prior, step] };
    });
  };

  const completeLastStep = () => {
    updateLastMessage((m) => {
      const timeline = m.timeline ?? [];
      if (timeline.length === 0) return m;
      const updated = [...timeline];
      updated[updated.length - 1] = { ...updated[updated.length - 1], status: "done" };
      return { ...m, timeline: updated };
    });
  };

  const toggleTimeline = (index: number) => {
    setMessages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], timelineCollapsed: !copy[index].timelineCollapsed };
      return copy;
    });
  };

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || isStreaming) return;

    setError(null);
    setOpen(true);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: q }];
    setMessages(nextMessages);
    setIsStreaming(true);
    scrollToBottom();

    const startedAt = Date.now();
    setLiveElapsed(0);
    const tickInterval = setInterval(() => setLiveElapsed(Date.now() - startedAt), 100);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "", timeline: [] }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as
            | { type: "stage"; label: string }
            | { type: "tool"; name: string; label: string }
            | { type: "token"; value: string }
            | { type: "done" };

          if (event.type === "stage") {
            const meta = STAGE_META[event.label] ?? { icon: "⚙️", label: event.label };
            appendStep(meta.icon, meta.label, "phase");
            scrollToBottom();
            await sleep(STEP_REVEAL_DELAY_MS);
          } else if (event.type === "tool") {
            appendStep(TOOL_ICONS[event.name] ?? "🔧", event.label, "agent");
            scrollToBottom();
            await sleep(STEP_REVEAL_DELAY_MS);
          } else if (event.type === "token") {
            if (content === "") completeLastStep();
            content += event.value;
            updateLastMessage((m) => ({ ...m, content }));
            scrollToBottom();
          } else if (event.type === "done") {
            const elapsedMs = Date.now() - startedAt;
            updateLastMessage((m) => ({
              ...m,
              timeline: [
                ...(m.timeline ?? []).map((s) => ({ ...s, status: "done" as const })),
                { id: "response-ready", icon: "✅", label: "Response Ready", kind: "phase", status: "done" },
              ],
              elapsedMs,
            }));
            await sleep(700);
            updateLastMessage((m) => ({ ...m, timelineCollapsed: true }));
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      clearInterval(tickInterval);
      setIsStreaming(false);
    }
  };

  const submitHero = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroInput;
    setHeroInput("");
    ask(q);
  };

  const submitComposer = (e: React.FormEvent) => {
    e.preventDefault();
    const q = composerInput;
    setComposerInput("");
    ask(q);
  };

  const clearConversation = () => {
    setMessages([]);
    setError(null);
    setHeroInput("");
    setComposerInput("");
    setOpen(false);
  };

  const playIntro = () => {
    setOpen(true);
    if (messages.length > 0) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMessages([{ role: "assistant", content: prefersReducedMotion ? INTRO_TEXT : "" }]);
    if (prefersReducedMotion) return;

    let i = 0;
    introIntervalRef.current = setInterval(() => {
      i += 3;
      const slice = INTRO_TEXT.slice(0, i);
      setMessages([{ role: "assistant", content: slice }]);
      scrollToBottom();
      if (i >= INTRO_TEXT.length && introIntervalRef.current) {
        clearInterval(introIntervalRef.current);
        introIntervalRef.current = null;
      }
    }, 16);
  };

  useImperativeHandle(ref, () => ({ startWithIntro: playIntro }));

  const hasConversation = messages.length > 0;

  return (
    <>
      <div className="mx-auto w-full max-w-xl">
        {!open && !hasConversation && (
          <>
            <motion.form
              onSubmit={submitHero}
              className="relative"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: EASE, delay: prefersReducedMotion ? 0 : 2.3 }}
            >
              <input
                id="naviq-ask-input"
                type="text"
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full rounded-full border border-white/40 bg-white/70 py-3.5 pl-5 pr-14 text-sm text-zinc-900 placeholder:text-zinc-400 backdrop-blur-xl transition-all duration-300 focus:border-violet-300/60 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.15),0_0_30px_-4px_rgba(139,92,246,0.35)] focus:outline-none dark:border-white/10 dark:bg-zinc-950/60 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-violet-500/40 dark:focus:bg-zinc-950/80"
              />
              <motion.button
                type="submit"
                disabled={!heroInput.trim()}
                whileHover={heroInput.trim() ? { scale: 1.08 } : undefined}
                whileTap={heroInput.trim() ? { scale: 0.92 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.4)] transition-shadow duration-300 hover:bg-violet-500 hover:shadow-[0_0_24px_rgba(139,92,246,0.65)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                aria-label="Send"
              >
                <ArrowUp className="h-4 w-4" />
              </motion.button>
            </motion.form>

            <motion.div
              className="mt-4 flex flex-wrap items-center justify-center gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: prefersReducedMotion ? 0 : 0.08,
                    delayChildren: prefersReducedMotion ? 0 : 2.6,
                  },
                },
              }}
            >
              {SUGGESTIONS.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  type="button"
                  onClick={() => ask(suggestion)}
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  className="rounded-full border border-white/30 bg-white/50 px-3.5 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur-md transition-colors duration-300 hover:border-violet-300/50 hover:bg-white/80 hover:text-zinc-900 hover:shadow-[0_4px_16px_-4px_rgba(139,92,246,0.35)] dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:border-violet-500/30 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
            <p className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-600">
              ⚡ Tool-calling agent · grounded in real resume data · powered by Groq
            </p>
          </>
        )}

        {!open && hasConversation && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white py-3.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <MessageCircle className="h-4 w-4" />
            Continue conversation
          </button>
        )}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
              onClick={() => setOpen(false)}
              role="presentation"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={`Chat with ${product.name}`}
                style={{ height: "min(640px, 85dvh)" }}
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="flex w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-white/30 bg-white/85 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/80 sm:rounded-3xl"
              >
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {product.name}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Online · Supervisor Agent
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={clearConversation}
                    aria-label="Clear conversation"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Minimize"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              <div
                ref={scrollRef}
                aria-live="polite"
                className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
              >
                {messages.length === 0 && (
                  <p className="text-center text-sm text-zinc-400 dark:text-zinc-600">
                    Ask about {firstName}&apos;s experience, projects, or skills.
                  </p>
                )}
                {messages.map((message, i) => {
                  const isLast = i === messages.length - 1;
                  const streamingThisMessage = isLast && isStreaming && message.role === "assistant";
                  const displayElapsed =
                    message.elapsedMs ?? (streamingThisMessage ? liveElapsed : 0);
                  const hasTimeline = (message.timeline?.length ?? 0) > 0;
                  const hideBubbleForTimeline = streamingThisMessage && hasTimeline && !message.content;

                  return (
                    <div
                      key={i}
                      className={cn("flex items-end gap-2", message.role === "user" && "flex-row-reverse")}
                    >
                      <Avatar role={message.role} />
                      <div
                        className={cn(
                          "flex max-w-[85%] flex-col gap-1.5",
                          message.role === "user" && "items-end"
                        )}
                      >
                        {message.role === "assistant" && message.timeline && message.timeline.length > 0 && (
                          <ReasoningTimeline
                            steps={message.timeline}
                            collapsed={Boolean(message.timelineCollapsed)}
                            onToggle={() => toggleTimeline(i)}
                            streaming={streamingThisMessage}
                            elapsedMs={displayElapsed}
                          />
                        )}

                        {!hideBubbleForTimeline && (
                          <div
                            className={cn(
                              "rounded-2xl px-3.5 py-2",
                              message.role === "user"
                                ? "whitespace-pre-wrap bg-violet-600 text-sm leading-6 text-white"
                                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                            )}
                          >
                            {message.content ? (
                              message.role === "assistant" ? (
                                <Markdown content={message.content} />
                              ) : (
                                message.content
                              )
                            ) : (
                              <span className="inline-flex gap-1">
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {error && (
                  <p className="text-sm text-red-500 dark:text-red-400" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <form onSubmit={submitComposer} className="border-t border-zinc-200 p-3 dark:border-zinc-800">
                <div className="relative">
                  <input
                    ref={composerRef}
                    type="text"
                    value={composerInput}
                    onChange={(e) => setComposerInput(e.target.value)}
                    placeholder={`Message ${product.name}...`}
                    disabled={isStreaming}
                    className="w-full rounded-full border border-zinc-200 bg-white py-3 pl-4 pr-12 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
                  />
                  <motion.button
                    type="submit"
                    disabled={isStreaming || !composerInput.trim()}
                    whileHover={!isStreaming && composerInput.trim() ? { scale: 1.08 } : undefined}
                    whileTap={!isStreaming && composerInput.trim() ? { scale: 0.92 } : undefined}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-violet-600 text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
});
