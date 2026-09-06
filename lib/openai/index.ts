import OpenAI from "openai";
import { z } from "zod";
import type { AIResponse, ConcernType } from "@/types";
import { detectCrisisSignal, SAFETY_MESSAGE } from "./safety";

const MAX_BRAIN_DUMP_LENGTH = 2000;

const resetStepSchema = z.object({
  title: z.string(),
  duration_seconds: z.number().int().positive(),
  instruction: z.string(),
});

const rawResponseSchema = z.object({
  safety_flag: z.boolean(),
  safety_message: z.string().nullable(),
  summary: z.string().nullable(),
  actionable_items: z.array(z.string()).nullable(),
  parked_items: z.array(z.string()).nullable(),
  reframe: z.string().nullable(),
  reset_steps: z.array(resetStepSchema).nullable(),
});

const JSON_SCHEMA = {
  name: "night_reset_response",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      safety_flag: {
        type: "boolean",
        description:
          "true only if the text expresses imminent self-harm, suicidal intent, immediate danger, or intent to hurt another person.",
      },
      safety_message: {
        type: ["string", "null"],
        description: "Populated only when safety_flag is true. A short, warm message pointing to real help.",
      },
      summary: { type: ["string", "null"] },
      actionable_items: { type: ["array", "null"], items: { type: "string" } },
      parked_items: { type: ["array", "null"], items: { type: "string" } },
      reframe: { type: ["string", "null"] },
      reset_steps: {
        type: ["array", "null"],
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            duration_seconds: { type: "number" },
            instruction: { type: "string" },
          },
          required: ["title", "duration_seconds", "instruction"],
        },
      },
    },
    required: [
      "safety_flag",
      "safety_message",
      "summary",
      "actionable_items",
      "parked_items",
      "reframe",
      "reset_steps",
    ],
  },
} as const;

const SYSTEM_PROMPT = `You are the wellness engine behind NightReset, an app that helps people who are lying awake with racing thoughts.

You are NOT a therapist, doctor, or crisis counselor. You never diagnose conditions (including anxiety, insomnia, depression), never prescribe or discuss medication, never claim to cure anything, and never claim certainty about someone's mental health. Your tone is warm, concise, calming, non-clinical, and non-judgmental. Never use corporate or hype language.

SAFETY (highest priority, check this first):
If the text expresses imminent self-harm, suicidal intent, immediate danger, or intent to hurt another person, set safety_flag to true, write a short warm safety_message encouraging contacting emergency services, a trusted person, or urgent professional help, and set every other field to null. Do not generate a normal reset in this case.

Otherwise, set safety_flag to false, safety_message to null, and do the following using the person's concern category and their own words:
1. summary: one or two sentences reflecting back what their mind is doing tonight (not clinical, just human).
2. actionable_items: 1-4 short, concrete things that can reasonably wait until tomorrow morning (things they could actually act on).
3. parked_items: 1-4 things that cannot be solved tonight and don't need an answer right now (predicting outcomes, imagining worst cases, ruminating).
4. reframe: one short, calming sentence that gives permission to stop tonight.
5. reset_steps: 5-8 steps forming a guided nighttime reset totalling roughly 7-10 minutes (sum of duration_seconds should land between 420 and 600 seconds). Each step has a short title, a duration_seconds, and one short calming instruction (one or two sentences, never a paragraph). Steps should cover: settling the body/breath, noticing physical sensations, releasing the parked thoughts, and a closing step. Keep instructions simple enough to read in a few seconds.

Never write long paragraphs anywhere. Keep every field short.`;

function buildUserPrompt(concern: ConcernType, brainDump: string): string {
  return `Concern category: ${concern}\n\nWhat's on their mind (their own words, verbatim):\n"""${brainDump}"""`;
}

export async function generateNightReset(
  concern: ConcernType,
  brainDump: string
): Promise<AIResponse> {
  const trimmed = brainDump.trim().slice(0, MAX_BRAIN_DUMP_LENGTH);

  if (detectCrisisSignal(trimmed)) {
    return { safety_flag: true, message: SAFETY_MESSAGE };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !model) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  // Optional: point at any OpenAI-compatible endpoint (e.g. Groq) instead of
  // api.openai.com. Left unset, the SDK talks to OpenAI as normal.
  const baseURL = process.env.OPENAI_BASE_URL || undefined;
  const client = new OpenAI({ apiKey, baseURL });

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(concern, trimmed) },
    ],
    response_format: { type: "json_schema", json_schema: JSON_SCHEMA },
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("AI_EMPTY_RESPONSE");
  }

  const parsed = rawResponseSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error("AI_MALFORMED_RESPONSE");
  }

  const data = parsed.data;

  if (data.safety_flag) {
    return { safety_flag: true, message: data.safety_message || SAFETY_MESSAGE };
  }

  if (!data.summary || !data.actionable_items || !data.parked_items || !data.reframe || !data.reset_steps) {
    throw new Error("AI_MALFORMED_RESPONSE");
  }

  return {
    summary: data.summary,
    actionable_items: data.actionable_items,
    parked_items: data.parked_items,
    reframe: data.reframe,
    reset_steps: data.reset_steps,
  };
}

export { MAX_BRAIN_DUMP_LENGTH };
