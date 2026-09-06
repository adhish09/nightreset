"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResetSummary } from "@/components/reset-summary";
import { ResetTimer } from "@/components/reset-timer";
import { track } from "@/lib/analytics/posthog-client";
import type { NightResetContent } from "@/types";

type Phase = "organize" | "guided" | "done";

export function ResetExperience({
  sessionId,
  content,
}: {
  sessionId: string;
  content: NightResetContent;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("organize");
  const [finishing, setFinishing] = useState(false);

  async function handleFinish() {
    setFinishing(true);
    try {
      await fetch(`/api/reset/${sessionId}/complete`, { method: "POST" });
      track("reset_completed");
    } finally {
      router.push("/dashboard");
      router.refresh();
    }
  }

  if (phase === "organize") {
    return <ResetSummary content={content} onBegin={() => setPhase("guided")} />;
  }

  if (phase === "guided") {
    return <ResetTimer steps={content.reset_steps} onFinished={() => setPhase("done")} />;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-accent/20 animate-breathe" />
        <Moon className="relative h-7 w-7 text-accent" />
      </div>
      <p className="text-xl font-medium tracking-tight">
        You don&apos;t need to solve anything else tonight.
      </p>
      <Button size="lg" onClick={handleFinish} disabled={finishing} className="w-full">
        {finishing ? "Wrapping up..." : "Finish Reset"}
      </Button>
    </div>
  );
}
