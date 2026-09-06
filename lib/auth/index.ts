import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/**
 * Always derive the authenticated user from the Supabase session cookie —
 * never trust a user id passed in from the client.
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuthenticatedUser(): Promise<User> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}
