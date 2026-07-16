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
import { SectionHeading } from "@/components/section-heading";
import { Skills } from "@/components/skills";
import { Terminal } from "@/components/terminal";
import type { SectionKey } from "@/lib/sections";

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
    Content: Experience,
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

function scrollToSection(key: SectionKey) {
  document.getElementById(key)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Portfolio() {
  const [booted, setBooted] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const focusChat = () => {
    document.getElementById("naviq-ask-input")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {!booted && <BootSequence onDone={() => setBooted(true)} />}

      <Header onNavigate={scrollToSection} />
      <main className="flex-1">
        <Hero onNavigate={scrollToSection} />
        <Highlights />

        {SECTIONS.map(({ key, eyebrow, title, description, Content }) => (
          <section key={key} id={key} className="scroll-mt-24 px-6 py-16 sm:py-20">
            <div className="mx-auto w-full max-w-3xl">
              <SectionHeading eyebrow={eyebrow} title={title} description={description} />
              <div className="mt-10">
                <Content />
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />

      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <CommandPalette
        onNavigateSection={scrollToSection}
        onOpenChat={focusChat}
        onOpenTerminal={() => setTerminalOpen(true)}
      />
    </>
  );
}
