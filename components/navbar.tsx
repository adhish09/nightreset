import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { getAuthenticatedUser } from "@/lib/auth";

export async function Navbar() {
  const user = await getAuthenticatedUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
          <Logo size={28} />
          <span>NightReset</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/pricing"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Pricing
          </Link>
          {user ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href="/start">Start My Night Reset</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
