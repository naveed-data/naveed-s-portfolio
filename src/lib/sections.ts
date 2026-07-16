import type { ComponentType } from "react";
import { Architecture } from "@/components/architecture";
import { Contact } from "@/components/contact";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { nav } from "@/lib/data";

export type SectionKey = "projects" | "skills" | "architecture" | "contact";

export const SECTION_COMPONENTS: Record<SectionKey, ComponentType> = {
  projects: Projects,
  skills: Skills,
  architecture: Architecture,
  contact: Contact,
};

export const SECTION_TITLES: Record<SectionKey, string> = Object.fromEntries(
  nav.map((item) => [item.href.slice(1), item.label])
) as Record<SectionKey, string>;

export function isSectionKey(value: string): value is SectionKey {
  return value in SECTION_COMPONENTS;
}
