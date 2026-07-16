"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Mail } from "lucide-react";
import { profile } from "@/lib/data";

export function CopyEmailButton({ className, label }: { className?: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — nothing more we can do.
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {copied ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
      {copied ? "Copied!" : label}
    </button>
  );
}
