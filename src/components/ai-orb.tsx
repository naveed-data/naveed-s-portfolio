export function AiOrb() {
  return (
    <div className="group relative hidden h-56 w-56 shrink-0 items-center justify-center lg:flex xl:h-64 xl:w-64">
      <div className="animate-drift absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/40 via-blue-500/25 to-fuchsia-500/30 blur-3xl" />

      <div className="absolute inset-8 rounded-full border border-white/20 dark:border-white/10" />
      <div className="animate-spin-slow absolute inset-8 rounded-full border-t-2 border-violet-400/60" />

      <div className="animate-orb-pulse absolute inset-10 rounded-full bg-gradient-to-br from-violet-400/70 to-blue-400/60 blur-xl transition-all duration-500 group-hover:from-violet-300/90 group-hover:to-blue-300/80" />

      <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-white to-violet-200 shadow-[0_0_60px_20px_rgba(139,92,246,0.35)] transition-all duration-500 group-hover:shadow-[0_0_80px_28px_rgba(139,92,246,0.55)] dark:from-violet-100 dark:to-blue-200" />
    </div>
  );
}
