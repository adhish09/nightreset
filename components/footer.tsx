import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">
          NightReset is a wellness tool, not medical care.{" "}
          <Link href="/safety" className="underline underline-offset-4 hover:text-foreground">
            Learn more
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/safety" className="hover:text-foreground">Safety</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-6xl px-4 text-xs text-muted-foreground/60 sm:px-6">
        © {new Date().getFullYear()} NightReset. All rights reserved.
      </p>
    </footer>
  );
}
