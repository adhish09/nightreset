"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics/posthog-client";

export function TrackView({
  event,
  properties,
}: {
  event: AnalyticsEvent;
  properties?: Record<string, string | number | boolean>;
}) {
  useEffect(() => {
    track(event, properties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
