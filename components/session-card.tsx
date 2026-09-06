"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { CONCERN_OPTIONS, type ConcernType } from "@/types";

function concernLabel(concern: ConcernType): string {
  return CONCERN_OPTIONS.find((o) => o.value === concern)?.label || concern;
}

export function SessionCard({
  id,
  concern,
  createdAt,
  status,
}: {
  id: string;
  concern: ConcernType;
  createdAt: string;
  status: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("sessions").delete().eq("id", id);
    router.refresh();
  }

  // Fixed locale (not `undefined`/system default) — this renders on both
  // server and client, and a locale mismatch between them causes a
  // hydration error since the formatted string would differ.
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white/[0.02] px-4 py-3">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-medium">{concernLabel(concern)}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
        {status === "completed" && <Badge variant="success">Completed</Badge>}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete this session"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
