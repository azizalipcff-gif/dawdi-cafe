// Admin auth — a single signed session cookie. The credentials live in
// ADMIN_EMAIL / ADMIN_PASSWORD and there is no users table, no Supabase auth,
// no roles. The one admin account is always super_admin.
import { cache } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { ADMIN_LOGIN_PATH } from "@/lib/constants";
import type { Admin, AdminRole } from "@/lib/types";

export async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

// Current admin (reads the signed session cookie). Returns null when logged out.
export const getCurrentAdmin = cache(async (): Promise<Admin | null> => {
  const email = await getSessionEmail();
  if (!email) return null;

  return {
    id: "",
    user_id: "",
    role: "super_admin" as AdminRole,
    is_suspended: false,
    permissions: null,
    created_at: "",
    updated_at: "",
    email,
    full_name: email,
  };
});

// Throws a redirect to the admin login page when there is no valid session.
export async function requireAdmin(): Promise<Admin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect(ADMIN_LOGIN_PATH);
  return admin;
}

// Roles/permissions were removed — the single admin account has full access.
export async function requireRole(_roles?: AdminRole[]): Promise<Admin> {
  void _roles;
  return requireAdmin();
}
