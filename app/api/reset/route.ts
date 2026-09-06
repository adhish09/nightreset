import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkAccess, incrementFreeUsage } from "@/lib/entitlement";
import { createSession, markSessionFailed, markSessionReady } from "@/lib/sessions";
import { generateNightReset } from "@/lib/openai";
import { isSafetyResponse } from "@/types";
import { resetRequestSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const parsed = resetRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }

  const access = await checkAccess(user.id);
  if (!access.hasAccess) {
    return NextResponse.json({ error: "PAYWALL" }, { status: 402 });
  }

  const { concern, brainDump } = parsed.data;
  const sessionId = await createSession(user.id, concern);

  try {
    const result = await generateNightReset(concern, brainDump);

    if (isSafetyResponse(result)) {
      await markSessionFailed(sessionId, user.id);
      return NextResponse.json({ sessionId, safety: true, message: result.message });
    }

    await markSessionReady(sessionId, user.id, result);

    if (access.reason === "free_session") {
      await incrementFreeUsage(user.id);
    }

    return NextResponse.json({ sessionId, safety: false, content: result });
  } catch (err) {
    console.error("reset generation failed", err instanceof Error ? err.message : "unknown error");
    await markSessionFailed(sessionId, user.id);
    return NextResponse.json(
      { error: "GENERATION_FAILED", message: "We couldn't build your reset just now. Please try again." },
      { status: 502 }
    );
  }
}
