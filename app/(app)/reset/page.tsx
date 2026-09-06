"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrainDump } from "@/components/brain-dump";
import { GeneratingLoader } from "@/components/generating-loader";
import { SafetyNotice } from "@/components/safety-notice";
import { clearDraft, getDraftBrainDump, getDraftConcern, saveDraftBrainDump } from "@/lib/draft";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics/posthog-client";
import { BRAIN_DUMP_MAX_LENGTH, BRAIN_DUMP_MIN_LENGTH } from "@/lib/validation";
import type { ConcernType } from "@/types";

export default function ResetIntakePage() {
  const router = useRouter();
  const [concern, setConcern] = useState<ConcernType | null>(null);
  const [ready, setReady] = useState(false);
  const [brainDump, setBrainDump] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [safetyMessage, setSafetyMessage] = useState<string | null>(null);

  useEffect(() => {
    // Reads one-time initial state from sessionStorage (an external system)
    // on mount — not derived from props/state, so this can't loop.
    const draftConcern = getDraftConcern();
    if (!draftConcern) {
      router.replace("/start");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConcern(draftConcern);
    setBrainDump(getDraftBrainDump());
    setReady(true);
  }, [router]);

  async function handleSubmit() {
    if (!concern) return;

    const trimmed = brainDump.trim();
    if (trimmed.length < BRAIN_DUMP_MIN_LENGTH) {
      setError("Tell us a little more about what's on your mind.");
      return;
    }
    if (trimmed.length > BRAIN_DUMP_MAX_LENGTH) {
      setError(`Let's keep it under ${BRAIN_DUMP_MAX_LENGTH} characters.`);
      return;
    }

    setError(null);
    saveDraftBrainDump(brainDump);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?redirect=/reset");
      return;
    }

    setSubmitting(true);
    track("brain_dump_submitted");

    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concern, brainDump: trimmed }),
      });

      if (res.status === 401) {
        router.push("/login?redirect=/reset");
        return;
      }

      if (res.status === 402) {
        router.push("/pricing?paywall=1");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      if (data.safety) {
        setSafetyMessage(data.message);
        setSubmitting(false);
        return;
      }

      track("reset_generated");
      clearDraft();
      router.push(`/reset/${data.sessionId}`);
    } catch {
      toast.error("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (safetyMessage) {
    return <SafetyNotice message={safetyMessage} />;
  }

  if (!ready) {
    return null;
  }

  if (submitting) {
    return <GeneratingLoader />;
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <BrainDump
        value={brainDump}
        onChange={(v) => {
          setBrainDump(v);
          if (error) setError(null);
        }}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
      />
    </section>
  );
}
