/**
 * Deterministic crisis pre-filter. Runs before the brain dump ever reaches
 * the model — a keyword match here short-circuits generation entirely, so
 * the safety response can never depend on model compliance alone.
 */
const CRISIS_PATTERNS: RegExp[] = [
  /\bkill(ing)?\s+myself\b/i,
  /\bend(ing)?\s+my\s+life\b/i,
  /\bsuicid/i,
  /\bwant\s+to\s+die\b/i,
  /\bdon'?t\s+want\s+to\s+(be\s+alive|live)\b/i,
  /\bself[\s-]?harm/i,
  /\bcutting\s+myself\b/i,
  /\bhurt(ing)?\s+myself\b/i,
  /\bno\s+reason\s+to\s+live\b/i,
  /\bkill(ing)?\s+(him|her|them|someone|somebody)\b/i,
  /\bhurt(ing)?\s+(him|her|them|someone|somebody)\b/i,
  /\bgoing\s+to\s+hurt\b/i,
];

export function detectCrisisSignal(text: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

export const SAFETY_MESSAGE =
  "It sounds like you're carrying something very heavy right now, and that matters more than any reset. " +
  "Please reach out to someone right now — a trusted person nearby, a local emergency number, or a crisis helpline in your country. " +
  "If you're in immediate danger, please contact emergency services now. You don't have to carry this alone tonight.";
