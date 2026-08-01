"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSession, SESSION_COOKIE, SESSION_AGE, SESSION_MAX_AGE } from "@/lib/session";
import { loginSchema } from "@/lib/validation";
import { ADMIN_PATH, ADMIN_LOGIN_PATH } from "@/lib/constants";

export type LoginState = { error?: string };

export async function loginAdmin(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Invalid email or password" };
  }

  const remember =
    formData.get("remember") === "on" || formData.get("remember") === "true";

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!adminEmail || !adminPassword || email !== adminEmail || password !== adminPassword) {
    return { error: "Invalid email or password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSession(email, remember), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: remember ? SESSION_MAX_AGE : SESSION_AGE,
  });

  // Honor the ?next= target set by the proxy, but only for internal admin
  // URLs (never allow open redirects).
  const next = formData.get("next");
  const target =
    typeof next === "string" && next.startsWith(ADMIN_PATH) && !next.startsWith("//")
      ? next
      : ADMIN_PATH;

  redirect(target);
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect(ADMIN_LOGIN_PATH);
}
