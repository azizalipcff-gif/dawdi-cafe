"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createClient, AUTH_REMEMBER_COOKIE, AUTH_SESSION_MAX_AGE } from "@/lib/supabase/server";
import { loginSchema, resetPasswordSchema, updatePasswordSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { getCurrentAdmin } from "@/lib/auth";
import { ADMIN_PATH, ADMIN_LOGIN_PATH, ADMIN_RESET_PATH } from "@/lib/constants";

export type LoginState = { error?: string; retryAfter?: number };

export type ResetState = { error?: string; success?: boolean };

export async function loginAdmin(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const remember =
    formData.get("remember") === "on" || formData.get("remember") === "true";

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? headerStore.get("x-real-ip");
  const limited = rateLimit(`login:${ip}`);
  if (!limited.ok) {
    return { error: `Too many attempts. Try again in ${limited.retryAfterSec} seconds.` };
  }

  const supabase = await createClient({ remember });
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }

  // Remember the "stay signed in" preference so middleware and token
  // refreshes keep the exact cookie lifetime the admin chose.
  const cookieStore = await cookies();
  cookieStore.set(AUTH_REMEMBER_COOKIE, remember ? "1" : "0", {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    ...(remember ? { maxAge: AUTH_SESSION_MAX_AGE } : {}),
  });

  // An authenticated Supabase user is not enough: the account must also exist
  // in the admins table with the super_admin role. Anyone else is signed
  // straight back out and shown the denial banner.
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "super_admin") {
    await supabase.auth.signOut();
    redirect(`${ADMIN_LOGIN_PATH}?denied=1`);
  }

  // Honor the ?next= target set by the proxy, but only for internal admin
  // URLs (never allow open redirects).
  const next = formData.get("next");
  const target =
    typeof next === "string" && next.startsWith(ADMIN_PATH) && !next.startsWith("//")
      ? next
      : ADMIN_PATH;

  revalidatePath(ADMIN_PATH, "layout");
  redirect(target);
}

export async function requestPasswordReset(
  prevState: ResetState,
  formData: FormData
): Promise<ResetState> {
  const parsed = resetPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid email address" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}${ADMIN_RESET_PATH}`,
  });

  if (error) {
    console.error("requestPasswordReset failed:", error.message);
    return { error: "Unable to send the reset link. Please try again." };
  }

  return { success: true };
}

export async function updatePassword(
  prevState: ResetState,
  formData: FormData
): Promise<ResetState> {
  const parsed = updatePasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid password" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    console.error("updatePassword failed:", error.message);
    return { error: "Unable to update your password. Please try again." };
  }

  revalidatePath(ADMIN_PATH, "layout");
  redirect(`${ADMIN_LOGIN_PATH}?reset=1`);
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath(ADMIN_PATH, "layout");
  redirect(ADMIN_LOGIN_PATH);
}
