"use client";

import { motion } from "framer-motion";
import { ExternalLink, Info, Lightbulb, Target, TrendingUp } from "lucide-react";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start gap-3 rounded-2xl border border-violet-200/60 bg-violet-50/60 px-4 py-3.5 dark:border-violet-500/20 dark:bg-violet-500/[0.06]"
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          This is a curated selection, not the full body of work. Several production systems
          aren&apos;t shown here due to proprietary code or client confidentiality. What follows
          was chosen to best demonstrate engineering depth and AI systems experience — ask NAVIQ
          if you&apos;d like to go deeper.
        </p>
      </motion.div>

      {projects.map((project, i) => (
        <motion.div
          key={project.name}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 260, damping: 24 }}
          whileHover={{ y: -4 }}
          className="rounded-2xl bg-gradient-to-br from-violet-500/30 via-transparent to-blue-500/20 p-px shadow-sm transition-shadow hover:shadow-lg hover:shadow-violet-500/10"
        >
          <div className="rounded-[15px] bg-white p-6 dark:bg-zinc-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">{project.name}</h3>
                <p className="text-sm font-medium text-violet-600 dark:text-violet-400">{project.tagline}</p>
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                  aria-label={`Open ${project.name}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex gap-2.5">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                    Problem
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{project.problem}</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                    Business Impact
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{project.impact}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-zinc-50 p-4 sm:grid-cols-4 dark:bg-zinc-900">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="text-center">
                  <p className="text-lg font-bold text-zinc-950 dark:text-white">{metric.value}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-zinc-500 dark:text-zinc-500">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                Engineering Highlights
              </p>
              <ul className="mt-2 space-y-2">
                {project.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative pl-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400 before:absolute before:left-0 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-zinc-400 dark:before:bg-zinc-600"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-5 flex gap-2.5 border-t border-zinc-100 pt-4 dark:border-zinc-900">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  Lessons Learned
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{project.lessons}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-500">
                  <span className="font-medium text-zinc-600 dark:text-zinc-400">Next:</span>{" "}
                  {project.futureImprovements}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
