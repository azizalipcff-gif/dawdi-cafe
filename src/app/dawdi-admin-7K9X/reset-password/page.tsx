import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { ResetPasswordClient } from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your DAWDI CAFE admin password.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  // The email link carries a PKCE code. Exchange it so the password-update
  // form can run under an authenticated (recovery) session.
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return (
        <ResetPasswordClient
          mode="request"
          error="This reset link is invalid or has expired. Request a new one below."
        />
      );
    }
  }

  const user = await getCurrentUser();
  const mode = user ? "update" : "request";

  return <ResetPasswordClient mode={mode} />;
}
