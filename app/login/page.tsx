import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Moon } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthenticatedUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to NightReset with a secure email link.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;
  const user = await getAuthenticatedUser();

  if (user) {
    redirect(redirectTo || "/dashboard");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground">
        <Moon className="h-4 w-4 text-accent" aria-hidden="true" />
        <span>NightReset</span>
      </Link>
      <Card className="w-full max-w-sm">
        <CardContent className="p-8">
          <h1 className="mb-1 text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Your free Night Reset is waiting.
          </p>
          <AuthForm redirect={redirectTo} />
        </CardContent>
      </Card>
    </div>
  );
}
