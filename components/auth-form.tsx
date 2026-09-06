"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ redirect }: { redirect?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Enter a valid email address.");
      setStatus("error");
      return;
    }

    try {
      const supabase = createClient();
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      if (redirect) callbackUrl.searchParams.set("redirect", redirect);

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: { emailRedirectTo: callbackUrl.toString() },
      });

      if (otpError) {
        setError("We couldn't send that link. Please try again in a moment.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="h-8 w-8 text-accent" aria-hidden="true" />
        <p className="font-medium">Check your email</p>
        <p className="text-sm text-muted-foreground">
          We sent a sign-in link to <span className="text-foreground">{email}</span>. Open it on
          this device to continue.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={status === "error"}
          aria-describedby={error ? "email-error" : undefined}
        />
        {error && (
          <p id="email-error" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" size="lg" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending link...
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" aria-hidden="true" />
            Continue with email
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No password needed — we&apos;ll email you a secure sign-in link.
      </p>
    </form>
  );
}
