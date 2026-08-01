// Server-side Supabase client (uses HTTP-only cookies for sessions)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cookie that records whether the admin asked to stay signed in. It lets the
// middleware and every subsequent token refresh keep the same cookie lifetime
// instead of silently promoting a "session" login to a persistent one.
export const AUTH_REMEMBER_COOKIE = "dawdi_admin_remember";

// Lifetime used for the auth cookies when "Remember me" is checked.
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function shouldPersist(cookieStore: Awaited<ReturnType<typeof cookies>>): boolean {
  return cookieStore.get(AUTH_REMEMBER_COOKIE)?.value !== "0";
}

export async function createClient(options?: { remember?: boolean }) {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }

  // remember === false → auth cookies become browser-session cookies (no
  // Max-Age) and disappear when the browser closes. When no option is passed,
  // fall back to the flag already stored on the browser so token refreshes
  // keep the lifetime the admin chose at login.
  const persist =
    options?.remember === undefined ? shouldPersist(cookieStore) : options.remember;

  return createServerClient(url, anonKey, {
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (!persist && value) {
              // Strip Max-Age so the auth cookie stays a session cookie.
              // Removals (empty value) must keep maxAge: 0 to actually
              // delete the cookie.
              const rest = options ? { ...options } : {};
              delete rest.maxAge;
              cookieStore.set(name, value, rest);
            } else {
              cookieStore.set(name, value, options);
            }
          });
        } catch {
          // Called from a Server Component or a static render where the
          // response is already committed. The proxy refreshes sessions, so
          // ignore and rely on the next request instead.
        }
      },
    },
  });
}
