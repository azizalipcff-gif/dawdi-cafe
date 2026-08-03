"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_LOGIN_PATH } from "@/lib/constants";

// Sign the current admin out and return to the login screen.
export async function signOut() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  // Best effort: revoke the session server-side. If the Supabase logout
  // request fails (offline, etc.), cookies are still cleared below so the
  // admin is never left in a logged-in state.
  try {
    await supabase.auth.signOut({ scope: "global" });
  } catch {
    // ignore
  }

  // Explicitly clear every Supabase session cookie as a safety net.
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith("sb-")) {
      cookieStore.set(cookie.name, "", { path: "/", maxAge: 0 });
    }
  }

  redirect(ADMIN_LOGIN_PATH);
}
