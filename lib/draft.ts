import type { ConcernType } from "@/types";

const CONCERN_KEY = "nr_draft_concern";
const BRAIN_DUMP_KEY = "nr_draft_brain_dump";

/**
 * The in-progress reset draft (concern + brain dump) lives only in
 * localStorage on this device — never sent to analytics, never persisted
 * server-side until the user actually submits for generation. localStorage
 * (rather than sessionStorage) is used so the draft survives a magic-link
 * sign-in that opens in a new tab.
 */
export function saveDraftConcern(concern: ConcernType) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONCERN_KEY, concern);
}

export function getDraftConcern(): ConcernType | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CONCERN_KEY) as ConcernType | null;
}

export function saveDraftBrainDump(text: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BRAIN_DUMP_KEY, text);
}

export function getDraftBrainDump(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(BRAIN_DUMP_KEY) || "";
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CONCERN_KEY);
  localStorage.removeItem(BRAIN_DUMP_KEY);
}
