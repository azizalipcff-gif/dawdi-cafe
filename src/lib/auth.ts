// Admin auth — relies only on Supabase Auth sessions and the SQL `admins`
// table. No hardcoded emails: a signed-in user is an admin if and only if a
// non-suspended row exists in public.admins (verified directly against the
// service-role client so the check is authoritative).
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_LOGIN_PATH } from "@/lib/constants";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

// The current authenticated user if they exist in the SQL `admins` table,
// are not suspended, otherwise null. We query the `admins` row directly with
// the service-role client so the check is authoritative and cannot be bypassed
// by a stale/forged RPC result. Suspended admins are rejected here.
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("admins")
    .select("role, is_suspended")
    .eq("user_id", user.id)
    .single();
  if (error || !data || data.is_suspended) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    role: data.role,
  };
});

// Throws a redirect to the admin login page when there is no valid admin session.
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect(ADMIN_LOGIN_PATH);
  return admin;
}
