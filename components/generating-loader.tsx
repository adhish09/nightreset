"use client";

import { useEffect, useState } from "react";
import { Moon } from "lucide-react";

const PHRASES = [
  "Let's untangle that...",
  "Separating what can wait...",
  "Building your reset...",
];

export function GeneratingLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => Math.min(i + 1, PHRASES.length - 1));
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-accent/20 animate-breathe" aria-hidden="true" />
        <Moon className="relative h-7 w-7 text-accent" aria-hidden="true" />
      </div>
      <p key={index} className="animate-fade-in text-lg text-muted-foreground">
        {PHRASES[index]}
      </p>
    </div>
  );
}
