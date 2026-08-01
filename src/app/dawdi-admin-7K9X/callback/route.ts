import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";
import { ADMIN_PATH, ADMIN_LOGIN_PATH } from "@/lib/constants";

// OAuth callback for the Google "Continue with Google" login.
// 1. Exchange the authorization code for a session.
// 2. Verify the account exists in the admins table.
//    - Admin  → dashboard
//    - Other  → sign out immediately + login?denied=1
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}${ADMIN_LOGIN_PATH}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth exchange failed:", error.message);
    return NextResponse.redirect(`${origin}${ADMIN_LOGIN_PATH}`);
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    // A signed-in Supabase user without an admins-table entry is not an
    // administrator. Sign them straight back out and show the denial.
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}${ADMIN_LOGIN_PATH}?denied=1`);
  }

  const target =
    typeof next === "string" && next.startsWith(ADMIN_PATH) && !next.startsWith("//")
      ? next
      : ADMIN_PATH;
  return NextResponse.redirect(`${origin}${target}`);
}
