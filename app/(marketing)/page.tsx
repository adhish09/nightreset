import Link from "next/link";
import { ArrowRight, Brain, Moon, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PricingCard } from "@/components/pricing-card";
import { TrackView } from "@/components/track-view";

const steps = [
  {
    title: "Tell us what's on your mind.",
    description: "A quick brain dump, written exactly as it sounds in your head.",
  },
  {
    title: "Separate what can wait from what needs action.",
    description: "We help sort your thoughts into what's actionable and what isn't.",
  },
  {
    title: "Follow your personalized reset.",
    description: "A short, guided sequence built around what's on your mind tonight.",
  },
  {
    title: "Let tonight be tonight.",
    description: "Put the thought down. The rest can wait for morning.",
  },
];

const faqs = [
  {
    q: "What is NightReset?",
    a: "NightReset is a short, guided wellness exercise for nights when your thoughts won't slow down. You write down what's on your mind, and we help you separate what can wait until tomorrow from what doesn't need an answer tonight — then guide you through a calming reset.",
  },
  {
    q: "Is NightReset therapy?",
    a: "No. NightReset is a wellness tool, not therapy, medical treatment, or a diagnostic service. It doesn't replace professional care. If you're dealing with persistent or severe distress, please see a licensed professional.",
  },
  {
    q: "Do I need an account?",
    a: "You can explore the product and start your first reset without committing to anything upfront. We'll ask you to sign in with a simple email link before generating your reset, so it's saved and ready when you come back.",
  },
  {
    q: "How does the ₹79 pass work?",
    a: "₹79 gets you unlimited Night Resets for 7 days from the moment you activate it. It's a one-time payment — no subscription, no auto-renewal.",
  },
  {
    q: "What happens after 7 days?",
    a: "Your pass simply ends. You can pick up another 7-night pass any time for ₹79.",
  },
  {
    q: "Is my brain dump private?",
    a: "Yes. What you write is stored securely and tied only to your account. We never share it, and it's never used for anything beyond generating your reset.",
  },
];

export default function LandingPage() {
  return (
    <>
      <TrackView event="landing_view" />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-muted-foreground">
            <Moon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span>A quiet 10 minutes before sleep</span>
          </div>
          <h1 className="glow-text text-4xl font-semibold tracking-tight sm:text-6xl">
            Your brain doesn&apos;t need to solve everything tonight.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A 10-minute guided reset for nights when your thoughts won&apos;t stop.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/start">
                Start My Night Reset
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No medication. No endless scrolling. Just a simple way to slow things down.
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your body is tired. Your brain has 37 tabs open.
          </h2>
          <p className="mt-4 text-muted-foreground">
            You lie down, and suddenly every unfinished thought shows up at once — tomorrow&apos;s
            meeting, that thing you said, money, the future. Scrolling doesn&apos;t quiet it.
            Trying to force sleep doesn&apos;t either. Your mind just needs a place to put things
            down for the night.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Card key={step.title} className="animate-fade-in">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-medium text-accent">
                    {i + 1}
                  </div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            See it in action
          </h2>
          <Card className="mt-10">
            <CardContent className="p-6 sm:p-8">
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <Brain className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  &ldquo;I have an exam tomorrow and I haven&apos;t studied enough.&rdquo;
                </span>
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-accent">
                    Can handle tomorrow
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="rounded-lg bg-white/[0.03] px-3 py-2">Review chapter 4</li>
                    <li className="rounded-lg bg-white/[0.03] px-3 py-2">Set a morning study block</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Can wait tonight
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="rounded-lg bg-white/[0.02] px-3 py-2">Predicting the exam result</li>
                    <li className="rounded-lg bg-white/[0.02] px-3 py-2">Imagining every possible outcome</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Try it free tonight
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every account gets one free Night Reset. Want more quiet nights after that?
          </p>
          <div className="mt-10">
            <PricingCard />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Questions
          </h2>
          <div className="mt-10 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-white/5 pb-6">
                <h3 className="font-medium">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety notice */}
      <section className="px-4 py-16 sm:px-6">
        <Card className="mx-auto max-w-3xl border-white/10 bg-white/[0.02]">
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:gap-4">
            <ShieldCheck className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              NightReset is a wellness tool, not medical care. It doesn&apos;t diagnose, treat, or
              replace professional support. If sleep problems are persistent or affecting your
              daily life, please talk to a doctor or licensed professional.{" "}
              <Link href="/safety" className="underline underline-offset-4 hover:text-foreground">
                Read our safety notice
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Sparkles className="h-6 w-6 text-accent" aria-hidden="true" />
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Let&apos;s put tonight down.
          </h2>
          <Button asChild size="lg">
            <Link href="/start">
              Start My Night Reset
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
