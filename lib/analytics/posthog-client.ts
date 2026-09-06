"use client";

import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key || typeof window === "undefined") return;

  posthog.init(key, {
    api_host: host || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    autocapture: false,
  });
  initialized = true;
}

/**
 * Analytics events only ever carry categorical/boolean metadata — never
 * brain dump text, email, or other free-form user content.
 */
export type AnalyticsEvent =
  | "landing_view"
  | "start_reset"
  | "concern_selected"
  | "brain_dump_submitted"
  | "reset_generated"
  | "reset_completed"
  | "paywall_view"
  | "checkout_started"
  | "payment_success";

export function track(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>) {
  if (!initialized) return;
  posthog.capture(event, properties);
}
