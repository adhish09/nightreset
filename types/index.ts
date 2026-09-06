export type ConcernType =
  | "racing_thoughts"
  | "work_or_studies"
  | "relationship"
  | "money"
  | "tomorrow"
  | "something_else"
  | "dont_know";

export const CONCERN_OPTIONS: { value: ConcernType; label: string }[] = [
  { value: "racing_thoughts", label: "Racing thoughts" },
  { value: "work_or_studies", label: "Work or studies" },
  { value: "relationship", label: "Relationship" },
  { value: "money", label: "Money" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "something_else", label: "Something else" },
  { value: "dont_know", label: "I don't know" },
];

export interface ResetStep {
  title: string;
  duration_seconds: number;
  instruction: string;
}

export interface NightResetContent {
  summary: string;
  actionable_items: string[];
  parked_items: string[];
  reframe: string;
  reset_steps: ResetStep[];
}

export interface SafetyResponse {
  safety_flag: true;
  message: string;
}

export type AIResponse = NightResetContent | SafetyResponse;

export function isSafetyResponse(res: AIResponse): res is SafetyResponse {
  return (res as SafetyResponse).safety_flag === true;
}

export interface SessionRow {
  id: string;
  user_id: string;
  concern: ConcernType;
  content: NightResetContent | null;
  status: "generating" | "ready" | "completed" | "failed";
  created_at: string;
  completed_at: string | null;
}

export interface EntitlementRow {
  id: string;
  user_id: string;
  active: boolean;
  activated_at: string;
  expires_at: string;
  payment_id: string | null;
}

export interface FreeUsageRow {
  user_id: string;
  sessions_used: number;
}

export interface PaymentRow {
  id: string;
  user_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  status: "created" | "paid" | "failed";
  amount: number;
  created_at: string;
}

export interface AccessStatus {
  hasAccess: boolean;
  reason: "entitlement" | "free_session" | "none";
  entitlement: EntitlementRow | null;
  freeSessionsUsed: number;
}
