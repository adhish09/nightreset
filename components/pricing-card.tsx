import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutButton } from "@/components/checkout-button";
import { NIGHTRESET_PASS_PRICE_INR } from "@/lib/razorpay";

const features = [
  "Unlimited Night Resets for 7 days",
  "Personalized AI-guided reset every night",
  "Private — your thoughts are never shared",
];

export function PricingCard({ autoStart = false }: { autoStart?: boolean }) {
  return (
    <Card className="mx-auto w-full max-w-sm border-accent/30 bg-card/80">
      <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">7 Nights</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">
            ₹{NIGHTRESET_PASS_PRICE_INR}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Unlimited Night Resets for 7 days.
          </p>
        </div>
        <ul className="w-full space-y-2 text-left text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <CheckoutButton size="lg" className="w-full" autoStart={autoStart}>
          Get 7 Nights — ₹{NIGHTRESET_PASS_PRICE_INR}
        </CheckoutButton>
        <p className="text-xs text-muted-foreground">
          One-time payment. No auto-renewal.
        </p>
      </CardContent>
    </Card>
  );
}
