import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { NightResetContent } from "@/types";

export function ResetSummary({
  content,
  onBegin,
}: {
  content: NightResetContent;
  onBegin: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-10 px-4 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Let&apos;s put tonight down.
        </h1>
        <p className="mt-3 text-muted-foreground">{content.summary}</p>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">
          Things you can handle tomorrow
        </p>
        <ul className="space-y-2">
          {content.actionable_items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Things that don&apos;t need an answer tonight
        </p>
        <ul className="space-y-2">
          {content.parked_items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl bg-white/[0.015] px-4 py-3 text-sm text-muted-foreground"
            >
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <Card className="border-accent/20 bg-accent/[0.06]">
        <CardContent className="p-6 text-center">
          <p className="text-base">{content.reframe}</p>
        </CardContent>
      </Card>

      <Button size="lg" onClick={onBegin} className="w-full">
        Begin your Night Reset
      </Button>
    </div>
  );
}
