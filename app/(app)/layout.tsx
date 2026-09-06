import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground">
            <Logo size={22} />
            <span>NightReset</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
