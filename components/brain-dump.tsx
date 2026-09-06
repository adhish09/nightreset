"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BRAIN_DUMP_MAX_LENGTH } from "@/lib/validation";

export function BrainDump({
  value,
  onChange,
  onSubmit,
  error,
  submitting,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error: string | null;
  submitting: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What&apos;s running through your mind?
        </h1>
        <p className="mt-2 text-muted-foreground">
          Write it exactly as it sounds in your head. Don&apos;t organize it.
        </p>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Everything that's keeping you awake..."
        maxLength={BRAIN_DUMP_MAX_LENGTH}
        rows={10}
        aria-label="What's running through your mind?"
        aria-invalid={!!error}
        aria-describedby={error ? "brain-dump-error" : undefined}
        className="min-h-56"
        autoFocus
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span id="brain-dump-error" className="text-destructive">
          {error}
        </span>
        <span>
          {value.length}/{BRAIN_DUMP_MAX_LENGTH}
        </span>
      </div>
      <Button size="lg" onClick={onSubmit} disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Working on it..." : "Help Me Unpack This"}
      </Button>
    </div>
  );
}
