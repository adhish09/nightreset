import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResetExperience } from "@/components/reset-experience";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSession } from "@/lib/sessions";

export default async function ResetSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/reset/${id}`)}`);
  }

  const session = await getSession(id, user.id);

  if (!session || !session.content) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-xl font-medium">We couldn&apos;t find that reset.</h1>
        <p className="text-sm text-muted-foreground">
          It may have failed to generate, or the link isn&apos;t valid for your account.
        </p>
        <Button asChild>
          <Link href="/start">Start a new reset</Link>
        </Button>
      </div>
    );
  }

  return <ResetExperience sessionId={session.id} content={session.content} />;
}
