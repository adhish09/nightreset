import { z } from "zod";

export const BRAIN_DUMP_MAX_LENGTH = 2000;
export const BRAIN_DUMP_MIN_LENGTH = 3;

export const concernEnum = z.enum([
  "racing_thoughts",
  "work_or_studies",
  "relationship",
  "money",
  "tomorrow",
  "something_else",
  "dont_know",
]);

export const resetRequestSchema = z.object({
  concern: concernEnum,
  brainDump: z
    .string()
    .trim()
    .min(BRAIN_DUMP_MIN_LENGTH, "Tell us a little more about what's on your mind.")
    .max(
      BRAIN_DUMP_MAX_LENGTH,
      `Let's keep it under ${BRAIN_DUMP_MAX_LENGTH} characters — just the main things on your mind.`
    ),
});
