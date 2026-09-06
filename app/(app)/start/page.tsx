import type { Metadata } from "next";
import { ConcernSelector } from "@/components/concern-selector";
import { TrackView } from "@/components/track-view";

export const metadata: Metadata = {
  title: "Start",
  description: "What's keeping you awake tonight?",
};

export default function StartPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-2xl flex-col justify-center px-4 py-16 sm:px-6">
      <TrackView event="start_reset" />
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        What&apos;s keeping you awake?
      </h1>
      <p className="mt-2 mb-8 text-muted-foreground">Pick whatever feels closest.</p>
      <ConcernSelector />
    </section>
  );
}
