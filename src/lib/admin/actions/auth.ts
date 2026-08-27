"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_LOGIN_PATH } from "@/lib/constants";
import { getClientIp, rateLimitLogin, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

// Application-level login. Supabase Auth remains the authoritative
// authenticator (we call signInWithPassword server-side); this only adds an
// IP-based rate limit in front of it to slow credential stuffing. Brute-force
// protection from Supabase itself is untouched.
export async function adminLogin(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const rl = await rateLimitLogin(await getClientIp());
  if (!rl.success) return { error: RATE_LIMIT_MESSAGE };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return {};
}

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
