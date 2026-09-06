import { createAdminClient } from "@/lib/supabase/admin";
import type { ConcernType, NightResetContent, SessionRow } from "@/types";

export async function createSession(userId: string, concern: ConcernType): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sessions")
    .insert({ user_id: userId, concern, status: "generating" })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("SESSION_CREATE_FAILED");
  }

  return data.id as string;
}

export async function markSessionReady(
  sessionId: string,
  userId: string,
  content: NightResetContent
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("sessions")
    .update({ content, status: "ready" })
    .eq("id", sessionId)
    .eq("user_id", userId);
}

export async function markSessionFailed(sessionId: string, userId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("sessions").update({ status: "failed" }).eq("id", sessionId).eq("user_id", userId);
}

export async function markSessionCompleted(sessionId: string, userId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("sessions")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("user_id", userId);
}

export async function getSession(sessionId: string, userId: string): Promise<SessionRow | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return null;
  return data as SessionRow | null;
}
