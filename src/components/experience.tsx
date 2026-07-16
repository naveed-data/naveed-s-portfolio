"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { education, experience } from "@/lib/data";

export function Experience() {
  return (
    <div className="space-y-10">
      <div className="space-y-5">
        {experience.map((job, i) => (
          <motion.div
            key={`${job.org}-${job.role}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 24 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-gradient-to-br from-violet-500/30 via-transparent to-blue-500/20 p-px shadow-sm transition-shadow hover:shadow-lg hover:shadow-violet-500/10"
          >
            <div className="rounded-[15px] bg-white p-6 dark:bg-zinc-950">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">{job.role}</h3>
                    <p className="text-sm font-medium text-violet-600 dark:text-violet-400">{job.org}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
                  {job.start} – {job.end}
                </span>
              </div>

              <ul className="mt-5 space-y-2">
                {job.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="relative pl-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400 before:absolute before:left-0 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-zinc-400 dark:before:bg-zinc-600"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Education</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 24 }}
              className="flex items-start gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">{edu.degree}</p>
                <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{edu.org}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  {edu.start} – {edu.end} · {edu.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
