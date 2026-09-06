import type { Metadata } from "next";
import { PricingCard } from "@/components/pricing-card";
import { Paywall } from "@/components/paywall";

export const metadata: Metadata = {
  title: "Pricing",
  description: "One-time ₹79 pass for 7 days of unlimited NightReset sessions.",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; paywall?: string }>;
}) {
  const params = await searchParams;
  const autoStart = params.checkout === "1";
  const isPaywall = params.paywall === "1";

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-lg">
        {isPaywall ? (
          <Paywall autoStart={autoStart} />
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Simple, one-time pricing
            </h1>
            <p className="mt-3 text-muted-foreground">
              No subscriptions. Just a 7-night pass whenever you need one.
            </p>
            <div className="mt-10">
              <PricingCard autoStart={autoStart} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
