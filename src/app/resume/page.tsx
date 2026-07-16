import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { education, experience, product, profile, projects, skillGroups } from "@/lib/data";
import { PrintButton } from "@/components/print-button";

export const metadata: Metadata = {
  title: `Resume — ${profile.name}`,
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50 print:bg-white print:text-black">
      <div className="no-print mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {product.name}
        </Link>
        <PrintButton />
      </div>

      <main className="mx-auto max-w-3xl px-6 pb-20 print:px-0">
        <header className="border-b border-zinc-200 pb-6 dark:border-zinc-800 print:border-black">
          <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
          <p className="mt-1 text-lg text-violet-600 dark:text-violet-400 print:text-black">{profile.title}</p>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 print:text-black">
            {profile.email} · {profile.phone} · {profile.location}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 print:text-black">
            {profile.linkedin} · {profile.github}
          </p>
        </header>

        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500 print:text-black">
            Summary
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300 print:text-black">
            {profile.summary}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500 print:text-black">
            Experience
          </h2>
          <div className="mt-3 space-y-5">
            {experience.map((job) => (
              <div key={`${job.org}-${job.role}`}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold">
                    {job.role} · {job.org}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 print:text-black">
                    {job.start} — {job.end}
                  </p>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {job.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-sm leading-6 text-zinc-700 dark:text-zinc-300 print:text-black"
                    >
                      • {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500 print:text-black">
            Projects
          </h2>
          <div className="mt-3 space-y-3">
            {projects.map((project) => (
              <div key={project.name}>
                <p className="text-sm font-semibold">
                  {project.name} <span className="font-normal text-zinc-500 dark:text-zinc-500 print:text-black">— {project.tagline}</span>
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300 print:text-black">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500 print:text-black">
            Skills
          </h2>
          <div className="mt-3 space-y-2">
            {skillGroups.map((group) => (
              <p key={group.title} className="text-sm leading-6 text-zinc-700 dark:text-zinc-300 print:text-black">
                <span className="font-semibold">{group.title}:</span> {group.skills.join(", ")}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500 print:text-black">
            Education
          </h2>
          <div className="mt-3 space-y-3">
            {education.map((item) => (
              <div key={item.degree} className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm font-semibold">{item.degree}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 print:text-black">
                    {item.org}
                    {item.detail ? ` · ${item.detail}` : ""}
                  </p>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 print:text-black">
                  {item.start} — {item.end}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
