import { Phone } from "lucide-react";
import { profile } from "@/lib/data";
import { CopyEmailButton } from "@/components/copy-email-button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export function Contact() {
  return (
    <div className="text-center">
      <p className="mx-auto max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Open to AI engineering roles, collaborations, and interesting problems. Reach out any
        time.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <CopyEmailButton
          label={profile.email}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
        />
        <a
          href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <Phone className="h-4 w-4" />
          {profile.phone}
        </a>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white"
          aria-label="LinkedIn"
        >
          <LinkedinIcon className="h-5 w-5" />
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white"
          aria-label="GitHub"
        >
          <GithubIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
