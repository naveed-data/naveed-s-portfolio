type Step = { title: string; detail: string };

export function ArchitectureDiagram({ steps }: { steps: Step[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/60 via-zinc-300 to-transparent dark:via-zinc-700">
        <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-violet-500 shadow-[0_0_8px_2px_rgba(139,92,246,0.6)] animate-flow-down" />
      </div>

      <div className="space-y-6">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="animate-fade-up relative flex gap-4 pl-0"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-white text-xs font-semibold text-violet-700 dark:border-violet-900 dark:bg-zinc-950 dark:text-violet-300">
              {i + 1}
            </div>
            <div className="pt-0.5">
              <p className="text-sm font-semibold text-zinc-950 dark:text-white">{step.title}</p>
              <p className="mt-0.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
