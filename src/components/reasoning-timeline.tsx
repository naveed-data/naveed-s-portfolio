"use client";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStep = {
  id: string;
  icon: string;
  label: string;
  kind: "phase" | "agent";
  status: "active" | "done";
};

export function ReasoningTimeline({
  steps,
  collapsed,
  onToggle,
  streaming,
  elapsedMs,
}: {
  steps: TimelineStep[];
  collapsed: boolean;
  onToggle: () => void;
  streaming: boolean;
  elapsedMs: number;
}) {
  if (steps.length === 0) return null;

  const agentCount = steps.filter((s) => s.kind === "agent").length;
  const hasMemory = steps.some((s) => s.label.startsWith("Memory"));

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-500 backdrop-blur transition-colors hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        <span aria-hidden>🧠</span>
        View AI Reasoning
        <span className="text-zinc-400 dark:text-zinc-600">· {elapsedMs}ms</span>
        <ChevronDown className="h-3 w-3" />
      </button>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60">
      <div className="flex items-center justify-between border-b border-zinc-200/70 px-4 py-2.5 dark:border-zinc-800/70">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">AI Execution</span>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Collapse reasoning"
          className="text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-b border-zinc-200/70 px-4 py-2.5 text-[11px] text-zinc-500 dark:border-zinc-800/70 dark:text-zinc-500 sm:grid-cols-4">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              streaming ? "animate-pulse bg-blue-500" : "bg-emerald-500"
            )}
          />
          Supervisor {streaming ? "Active" : "Done"}
        </div>
        <div>Agents: {agentCount > 0 ? agentCount : "—"}</div>
        <div>Memory: {hasMemory ? "Loaded" : "—"}</div>
        <div>Knowledge Base: Connected</div>
        <div className="col-span-2 sm:col-span-4">Response Time: {elapsedMs}ms</div>
      </div>

      <div className="space-y-3 px-4 py-4">
        {steps.map((step, i) => (
          <div key={step.id} className="animate-fade-up relative flex items-center gap-3">
            {i < steps.length - 1 && (
              <div
                aria-hidden
                className={cn(
                  "absolute left-4 top-8 h-[calc(100%+0.5rem)] w-px",
                  step.status === "done" ? "bg-emerald-300 dark:bg-emerald-800" : "bg-zinc-200 dark:bg-zinc-800"
                )}
              />
            )}
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm transition-colors duration-300",
                step.status === "done"
                  ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950"
                  : "animate-pulse border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-950"
              )}
            >
              <span aria-hidden>{step.icon}</span>
              {step.status === "done" && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-sm",
                step.status === "done"
                  ? "text-zinc-500 dark:text-zinc-500"
                  : "font-medium text-zinc-800 dark:text-zinc-200"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
