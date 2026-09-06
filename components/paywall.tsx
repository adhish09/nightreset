import { PricingCard } from "@/components/pricing-card";
import { TrackView } from "@/components/track-view";

export function Paywall({ autoStart = false }: { autoStart?: boolean }) {
  return (
    <div className="text-center">
      <TrackView event="paywall_view" />
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Want 7 more nights of quieter evenings?
      </h1>
      <p className="mt-3 text-muted-foreground">
        You&apos;ve used your free Night Reset. One more step and you&apos;re set for a week.
      </p>
      <div className="mt-10">
        <PricingCard autoStart={autoStart} />
      </div>
    </div>
  );
}
