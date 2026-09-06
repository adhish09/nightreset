"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics/posthog-client";
import { NIGHTRESET_PASS_PRICE_INR } from "@/lib/razorpay";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export function CheckoutButton({
  children,
  autoStart = false,
  ...buttonProps
}: ButtonProps & { autoStart?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const autoStarted = useRef(false);

  async function startCheckout() {
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent("/pricing?checkout=1")}`);
        return;
      }

      track("checkout_started");

      const orderRes = await fetch("/api/payment/create-order", { method: "POST" });
      if (!orderRes.ok) {
        toast.error("We couldn't start checkout. Please try again.");
        return;
      }
      const order = await orderRes.json();

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey || typeof window.Razorpay === "undefined") {
        toast.error("Payments aren't available right now. Please try again shortly.");
        return;
      }

      const rzp = new window.Razorpay({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "NightReset",
        description: `7-Day Pass — ₹${NIGHTRESET_PASS_PRICE_INR}`,
        order_id: order.orderId,
        prefill: { email: user.email },
        theme: { color: "#6d7dfc" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          if (!verifyRes.ok) {
            toast.error("Payment received but activation failed. We'll sort this out — contact support.");
            return;
          }

          track("payment_success");
          toast.success("You're set for 7 nights.");
          router.push("/dashboard");
          router.refresh();
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch {
      toast.error("Something went wrong starting checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoStart && scriptReady && !autoStarted.current) {
      autoStarted.current = true;
      startCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, scriptReady]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
      />
      <Button {...buttonProps} disabled={loading} onClick={startCheckout}>
        {loading ? "Starting checkout..." : children}
      </Button>
    </>
  );
}
