import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";

// OAuth callback for the Google "Continue with Google" login.
// 1. Exchange the authorization code for a session.
// 2. Verify the account exists in the admins table.
//    - Admin  → /admin (dashboard)
//    - Other  → sign out immediately + /admin/login?denied=1
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth exchange failed:", error.message);
    return NextResponse.redirect(`${origin}/admin/login`);
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    // A signed-in Supabase user without an admins-table entry is not an
    // administrator. Sign them straight back out and show the denial.
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/admin/login?denied=1`);
  }

  const target =
    typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//")
      ? next
      : "/admin";
  return NextResponse.redirect(`${origin}${target}`);
}
