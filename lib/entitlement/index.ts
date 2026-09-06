import { createAdminClient } from "@/lib/supabase/admin";
import type { AccessStatus, EntitlementRow } from "@/types";

const FREE_SESSIONS_ALLOWED = 1;
const ENTITLEMENT_DURATION_DAYS = 7;

/**
 * Server-only. Never derive this from client-supplied flags — always look up
 * the row fresh and compare expires_at against the current server time.
 */
export async function getActiveEntitlement(userId: string): Promise<EntitlementRow | null> {
  const supabase = createAdminClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("entitlements")
    .select("*")
    .eq("user_id", userId)
    .eq("active", true)
    .gt("expires_at", nowIso)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("entitlement lookup failed");
    return null;
  }

  return data as EntitlementRow | null;
}

export async function hasActiveEntitlement(userId: string): Promise<boolean> {
  const entitlement = await getActiveEntitlement(userId);
  return entitlement !== null;
}

export async function getFreeSessionsUsed(userId: string): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("free_usage")
    .select("sessions_used")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return 0;
  return data.sessions_used ?? 0;
}

/**
 * Temporary launch-day switch: set PAYWALL_ENABLED=false to give every
 * signed-in user unlimited resets while validating demand, with no changes
 * to the payment code paths. Flip it back to "true" (or unset it) to
 * restore the real 1-free-then-pay flow — nothing else needs to change.
 */
function isPaywallEnabled(): boolean {
  return process.env.PAYWALL_ENABLED !== "false";
}

export async function checkAccess(userId: string): Promise<AccessStatus> {
  const entitlement = await getActiveEntitlement(userId);
  if (entitlement) {
    return { hasAccess: true, reason: "entitlement", entitlement, freeSessionsUsed: 0 };
  }

  const freeSessionsUsed = await getFreeSessionsUsed(userId);

  if (!isPaywallEnabled()) {
    return { hasAccess: true, reason: "free_session", entitlement: null, freeSessionsUsed };
  }

  if (freeSessionsUsed < FREE_SESSIONS_ALLOWED) {
    return { hasAccess: true, reason: "free_session", entitlement: null, freeSessionsUsed };
  }

  return { hasAccess: false, reason: "none", entitlement: null, freeSessionsUsed };
}

export async function incrementFreeUsage(userId: string): Promise<void> {
  const supabase = createAdminClient();
  const current = await getFreeSessionsUsed(userId);

  const { error } = await supabase
    .from("free_usage")
    .upsert({ user_id: userId, sessions_used: current + 1 }, { onConflict: "user_id" });

  if (error) {
    console.error("failed to increment free usage");
  }
}

/**
 * Idempotent: a unique constraint on payments.razorpay_payment_id (and this
 * existence check) ensures a webhook retry or duplicate verify call can never
 * mint a second entitlement for the same payment.
 */
export async function createEntitlementForPayment(
  userId: string,
  paymentRowId: string
): Promise<EntitlementRow | null> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("entitlements")
    .select("*")
    .eq("payment_id", paymentRowId)
    .maybeSingle();

  if (existing) {
    return existing as EntitlementRow;
  }

  const activatedAt = new Date();
  const expiresAt = new Date(activatedAt.getTime() + ENTITLEMENT_DURATION_DAYS * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from("entitlements")
    .insert({
      user_id: userId,
      active: true,
      activated_at: activatedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      payment_id: paymentRowId,
    })
    .select("*")
    .single();

  if (error) {
    console.error("failed to create entitlement");
    return null;
  }

  return data as EntitlementRow;
}
