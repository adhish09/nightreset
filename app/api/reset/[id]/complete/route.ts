import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSession, markSessionCompleted } from "@/lib/sessions";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const { id } = await params;
  const session = await getSession(id, user.id);
  if (!session) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  await markSessionCompleted(id, user.id);
  return NextResponse.json({ success: true });
}
