import type { Metadata } from "next";
import { NIGHTRESET_PASS_PRICE_INR } from "@/lib/razorpay";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for NightReset.",
};

export default function TermsPage() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of use</h1>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="text-base font-medium text-foreground">The product</h2>
            <p className="mt-2">
              NightReset is a wellness tool that helps you organize racing thoughts and follow a
              short guided reset before sleep. It is not therapy, medical treatment, a diagnostic
              tool, or a substitute for professional care.
            </p>
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">Your account</h2>
            <p className="mt-2">
              You&apos;re responsible for keeping access to your email secure, since we use
              passwordless sign-in. Every account receives one free complete Night Reset.
            </p>
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">Payment</h2>
            <p className="mt-2">
              The NightReset 7-Day Pass is a one-time payment of ₹{NIGHTRESET_PASS_PRICE_INR} that
              grants unlimited Night Resets for 7 days from activation. It does not auto-renew. All
              payments are processed by Razorpay; we never see or store your card details.
            </p>
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">Refunds</h2>
            <p className="mt-2">
              If you believe you were charged in error, contact us and we&apos;ll look into it.
            </p>
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">Acceptable use</h2>
            <p className="mt-2">
              Please don&apos;t use NightReset as a substitute for emergency services or professional
              mental health care. See our{" "}
              <a href="/safety" className="underline underline-offset-4 hover:text-foreground">
                safety notice
              </a>{" "}
              for more.
            </p>
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">Changes</h2>
            <p className="mt-2">
              We may update these terms as the product evolves. Continued use means you accept the
              current version.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
