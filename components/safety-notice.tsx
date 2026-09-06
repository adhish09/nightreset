import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SafetyNotice({ message }: { message: string }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
      <HeartHandshake className="h-9 w-9 text-accent" aria-hidden="true" />
      <Card className="border-white/10 bg-white/[0.02]">
        <CardContent className="p-6">
          <p className="text-base leading-relaxed">{message}</p>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/safety">More on safety</Link>
        </Button>
        <Button asChild>
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
