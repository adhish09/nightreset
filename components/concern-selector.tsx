"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONCERN_OPTIONS, type ConcernType } from "@/types";
import { saveDraftConcern } from "@/lib/draft";
import { track } from "@/lib/analytics/posthog-client";

export function ConcernSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState<ConcernType | null>(null);

  function handleContinue() {
    if (!selected) return;
    saveDraftConcern(selected);
    track("concern_selected", { concern: selected });
    router.push("/reset");
  }

  return (
    <div className="flex flex-col gap-8">
      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <legend className="sr-only">What&apos;s keeping you awake?</legend>
        {CONCERN_OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected(option.value)}
              className={cn(
                "min-h-14 rounded-xl border px-5 py-4 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-accent bg-accent/15 text-foreground"
                  : "border-border bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </fieldset>
      <Button size="lg" disabled={!selected} onClick={handleContinue} className="w-full sm:w-auto">
        Continue
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
