import { skillGroups } from "@/lib/data";

export function Skills() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {skillGroups.map((group) => (
        <div key={group.title}>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">{group.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
