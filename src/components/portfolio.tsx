"use client";

import { useState } from "react";
import { BootSequence } from "@/components/boot-sequence";
import { CommandPalette } from "@/components/command-palette";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { SectionPanel } from "@/components/section-panel";
import { Terminal } from "@/components/terminal";
import type { SectionKey } from "@/lib/sections";

export function Portfolio() {
  const [active, setActive] = useState<SectionKey | null>(null);
  const [booted, setBooted] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const focusChat = () => {
    setActive(null);
    document.getElementById("naviq-ask-input")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {!booted && <BootSequence onDone={() => setBooted(true)} />}

      <Header onNavigate={setActive} />
      <main className="flex-1">
        <Hero onNavigate={setActive} />
      </main>
      <Footer />

      <SectionPanel active={active} onClose={() => setActive(null)} />
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <CommandPalette
        onNavigateSection={setActive}
        onOpenChat={focusChat}
        onOpenTerminal={() => setTerminalOpen(true)}
      />
    </>
  );
}
