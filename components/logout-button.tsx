"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton(props: ButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" {...props} onClick={handleLogout}>
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Log out
    </Button>
  );
}
