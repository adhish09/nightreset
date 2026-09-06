import type { ResetStep as ResetStepType } from "@/types";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ResetStep({ step, secondsLeft }: { step: ResetStepType; secondsLeft: number }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-accent/15 animate-breathe" />
        <span className="absolute inset-4 rounded-full bg-accent/10" />
        <span className="text-2xl font-medium tabular-nums text-foreground/90">
          {formatTime(secondsLeft)}
        </span>
      </div>
      <div className="max-w-md">
        <h2 className="text-xl font-medium tracking-tight sm:text-2xl">{step.title}</h2>
        <p className="mt-3 text-muted-foreground">{step.instruction}</p>
      </div>
    </div>
  );
}
