import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="w-full py-6 text-center">
      <p className="text-xs text-zinc-400 dark:text-zinc-600">
        Designed &amp; Engineered by {profile.name}
      </p>
    </footer>
  );
}
