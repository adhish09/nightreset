import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionCard } from "@/components/session-card";
import { LogoutButton } from "@/components/logout-button";
import { CheckoutButton } from "@/components/checkout-button";
import { getAuthenticatedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveEntitlement } from "@/lib/entitlement";
import { NIGHTRESET_PASS_PRICE_INR } from "@/lib/razorpay";
import { CONCERN_OPTIONS, type ConcernType, type SessionRow } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

function concernLabel(concern: ConcernType): string {
  return CONCERN_OPTIONS.find((o) => o.value === concern)?.label || concern;
}

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const supabase = await createClient();
  const [{ data: sessions }, entitlement] = await Promise.all([
    supabase
      .from("sessions")
      .select("id, concern, status, created_at, completed_at")
      .order("created_at", { ascending: false })
      .limit(50),
    getActiveEntitlement(user.id),
  ]);

  const sessionRows = (sessions || []) as Pick<
    SessionRow,
    "id" | "concern" | "status" | "created_at" | "completed_at"
  >[];

  const completedSessions = sessionRows.filter((s) => s.status === "completed");
  const lastReset = completedSessions[0];

  const concernCounts = new Map<string, number>();
  for (const s of sessionRows) {
    concernCounts.set(s.concern, (concernCounts.get(s.concern) || 0) + 1);
  }
  const mostCommonConcern = [...concernCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] as
    | ConcernType
    | undefined;

  const expiresLabel = entitlement
    ? new Date(entitlement.expires_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Good evening.</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <Card className="mb-8">
        <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-accent" aria-hidden="true" />
            <div>
              <p className="font-medium">
                {entitlement ? "NightReset 7-Day Pass" : "Free"}
              </p>
              <p className="text-sm text-muted-foreground">
                {entitlement
                  ? `Active until ${expiresLabel}`
                  : "Your 7-night pass has ended, or you haven't started one yet."}
              </p>
            </div>
          </div>
          {!entitlement && (
            <CheckoutButton>Get another 7 nights — ₹{NIGHTRESET_PASS_PRICE_INR}</CheckoutButton>
          )}
        </CardContent>
      </Card>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-2xl font-semibold">{completedSessions.length}</p>
            <p className="text-sm text-muted-foreground">Resets completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-2xl font-semibold">
              {lastReset
                ? new Date(lastReset.completed_at || lastReset.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </p>
            <p className="text-sm text-muted-foreground">Last reset</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-2xl font-semibold">
              {mostCommonConcern ? concernLabel(mostCommonConcern) : "—"}
            </p>
            <p className="text-sm text-muted-foreground">Most common concern</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium">Session history</h2>
        <Button asChild size="sm">
          <Link href="/start">New reset</Link>
        </Button>
      </div>

      {sessionRows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No resets yet. Start your first one whenever you&apos;re ready.
        </p>
      ) : (
        <div className="space-y-3">
          {sessionRows.map((s) => (
            <SessionCard
              key={s.id}
              id={s.id}
              concern={s.concern}
              createdAt={s.created_at}
              status={s.status}
            />
          ))}
        </div>
      )}
    </section>
  );
}
