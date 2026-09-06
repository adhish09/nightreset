import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How NightReset handles your data, in plain English.",
};

export default function PrivacyPage() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
        <p className="mt-4 text-muted-foreground">
          Plain English, no legalese we wouldn&apos;t want to read ourselves.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="text-base font-medium text-foreground">What you write is private</h2>
            <p className="mt-2">
              Your brain dumps are stored so you can generate your reset and, if you choose, revisit
              your history. They are tied only to your account and are never shared with anyone,
              never sold, and never used to train AI models beyond generating your own reset.
            </p>
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">What we don&apos;t do</h2>
            <p className="mt-2">
              We never send the text of your brain dump to analytics tools, we never log it to our
              servers&apos; console output, and we never include it in error reports. Your dashboard
              only shows the date and general concern category of past sessions, not the raw text.
            </p>
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">Who can see your data</h2>
            <p className="mt-2">
              Only you. Our database enforces row-level security so your sessions, payments, and
              entitlements are only ever readable by your own account — not by other users, and not
              by us in the normal course of operating the product.
            </p>
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">You can delete your history</h2>
            <p className="mt-2">
              Your dashboard has a delete option for individual sessions, any time you want to clear
              them.
            </p>
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">Third parties we use</h2>
            <p className="mt-2">
              We use Supabase for authentication and data storage, OpenAI to generate your reset
              content, Razorpay to process payments, and PostHog for basic, anonymized product
              analytics (page views and feature usage — never your written thoughts).
            </p>
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">Questions</h2>
            <p className="mt-2">
              If you have questions about your data, reach out and we&apos;ll help.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
