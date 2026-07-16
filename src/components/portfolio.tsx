"use client";

import { useState } from "react";
import { Architecture } from "@/components/architecture";
import { BootSequence } from "@/components/boot-sequence";
import { CommandPalette } from "@/components/command-palette";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Highlights } from "@/components/highlights";
import { Projects } from "@/components/projects";
import { SectionModal } from "@/components/section-modal";
import { Skills } from "@/components/skills";
import { Terminal } from "@/components/terminal";
import type { SectionKey } from "@/lib/sections";

function ExperienceSection() {
  return (
    <div className="space-y-10">
      <Highlights />
      <Experience />
    </div>
  );
}

const SECTIONS: {
  key: SectionKey;
  eyebrow: string;
  title: string;
  description?: string;
  Content: React.ComponentType;
}[] = [
  {
    key: "experience",
    eyebrow: "Experience",
    title: "Where I've built this",
    description: "Production AI and data engineering roles across banking and healthcare.",
    Content: ExperienceSection,
  },
  {
    key: "projects",
    eyebrow: "Projects",
    title: "Systems I've shipped",
    description: "A curated set of RAG and agentic systems, end to end.",
    Content: Projects,
  },
  {
    key: "architecture",
    eyebrow: "Architecture",
    title: "How this site is built",
    description: "This isn't a diagram of some other system — it's exactly how the chat you just used works.",
    Content: Architecture,
  },
  {
    key: "skills",
    eyebrow: "Skills",
    title: "Tools of the trade",
    Content: Skills,
  },
  {
    key: "contact",
    eyebrow: "Contact",
    title: "Let's talk",
    Content: Contact,
  },
];

export function Portfolio() {
  const [booted, setBooted] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  const focusChat = () => {
    document.getElementById("naviq-ask-input")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const active = SECTIONS.find((s) => s.key === activeSection) ?? null;

  return (
    <>
      {!booted && <BootSequence onDone={() => setBooted(true)} />}

      <Header onNavigate={setActiveSection} />
      <main className="flex-1">
        <Hero onNavigate={setActiveSection} />
      </main>
      <Footer />

      <SectionModal
        open={active !== null}
        onClose={() => setActiveSection(null)}
        eyebrow={active?.eyebrow ?? ""}
        title={active?.title ?? ""}
        description={active?.description}
      >
        {active && <active.Content />}
      </SectionModal>

      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <CommandPalette
        onNavigateSection={setActiveSection}
        onOpenChat={focusChat}
        onOpenTerminal={() => setTerminalOpen(true)}
      />
    </>
  );
}
