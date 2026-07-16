"use client";

import { motion } from "framer-motion";
import { agentRoster, architecturePipeline, architectureStack } from "@/lib/data";
import { ArchitectureDiagram } from "@/components/architecture-diagram";

const STACK_GROUPS: { title: string; items: readonly string[] }[] = [
  { title: "Frontend", items: architectureStack.frontend },
  { title: "Backend", items: architectureStack.backend },
  { title: "AI", items: architectureStack.ai },
  { title: "Deployment", items: architectureStack.deployment },
];

export function Architecture() {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          This isn&apos;t a diagram of some other system — it&apos;s exactly how the chat you just used is built.
        </p>
        <div className="mt-6">
          <ArchitectureDiagram steps={architecturePipeline} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Agent Roster</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {agentRoster.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 24 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl bg-gradient-to-br from-violet-500/25 via-transparent to-blue-500/15 p-px shadow-sm transition-shadow hover:shadow-lg hover:shadow-violet-500/10"
            >
              <div className="h-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">{agent.name}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{agent.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Tech Stack</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {STACK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                {group.title}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
