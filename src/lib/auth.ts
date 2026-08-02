// Admin auth — relies only on Supabase Auth sessions and the SQL `admins`
// table. No hardcoded emails: a signed-in user is an admin if and only if a
// row exists in public.admins (checked via the admin_role() SQL function).
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_LOGIN_PATH } from "@/lib/constants";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

// The current authenticated user if they exist in the SQL `admins` table,
// otherwise null.
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: role, error } = await supabase.rpc("admin_role");
  if (error || !role) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    role,
  };
});

// Throws a redirect to the admin login page when there is no valid admin session.
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect(ADMIN_LOGIN_PATH);
  return admin;
}
