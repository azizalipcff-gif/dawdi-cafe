import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ADMIN_PATH, ADMIN_LOGIN_PATH } from "@/lib/constants";
import type { Admin, AdminRole } from "@/lib/types";

// Current authenticated user (cached per request)
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

// Current admin with role (verifies against the admins table)
export const getCurrentAdmin = cache(async (): Promise<Admin | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: admin } = await supabase
    .from("admins")
    .select("*, profiles(full_name)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) return null;

  // Suspended admins are treated as non-admins until reactivated.
  if (admin.is_suspended) return null;

  const profile = admin.profiles as unknown as { full_name: string | null } | null;

  return {
    id: admin.id,
    user_id: admin.user_id,
    role: admin.role as AdminRole,
    is_suspended: admin.is_suspended,
    permissions: admin.permissions,
    created_at: admin.created_at,
    updated_at: admin.updated_at,
    email: user.email ?? undefined,
    full_name: profile?.full_name ?? user.user_metadata?.full_name ?? null,
  };
});

// Throws a redirect when there is no valid admin session.
// - Logged out            → admin login page
// - Logged in, not admin  → / (public homepage). Redirecting a signed-in
//   non-admin back to the admin login used to create an infinite redirect loop.
export async function requireAdmin(): Promise<Admin> {
  const user = await getCurrentUser();
  if (!user) redirect(ADMIN_LOGIN_PATH);

  const admin = await getCurrentAdmin();
  if (!admin) redirect("/");
  return admin;
}

// Verifies the admin holds at least one of the allowed roles
export async function requireRole(roles: AdminRole[]): Promise<Admin> {
  const admin = await requireAdmin();
  if (!roles.includes(admin.role)) redirect(ADMIN_PATH);
  return admin;
}

// Uses the service-role client to look up any admin (used by the settings/users pages)
export async function getAdminByUserId(userId: string): Promise<Admin | null> {
  const admin = await createAdminClient();
  const { data } = await admin
    .from("admins")
    .select("*, profiles(full_name)")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return null;

  const profile = data.profiles as unknown as { full_name: string | null } | null;
  return {
    id: data.id,
    user_id: data.user_id,
    role: data.role as AdminRole,
    is_suspended: data.is_suspended,
    permissions: data.permissions,
    created_at: data.created_at,
    updated_at: data.updated_at,
    full_name: profile?.full_name ?? null,
  };
}

export async function listAdminUsers(): Promise<Admin[]> {
  const admin = await createAdminClient();
  const { data } = await admin
    .from("admins")
    .select("*, profiles(full_name)");

  return (data ?? []).map((a) => ({
    id: a.id,
    user_id: a.user_id,
    role: a.role as AdminRole,
    is_suspended: a.is_suspended,
    permissions: a.permissions,
    created_at: a.created_at,
    updated_at: a.updated_at,
    email: a.email as string | undefined,
    full_name: (a.profiles as unknown as { full_name: string | null } | null)?.full_name ?? null,
  }));
}
