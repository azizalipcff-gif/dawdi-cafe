import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { ADMIN_PATH } from "@/lib/constants";
import { AdminLoginClient } from "./AdminLoginClient";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the DAWDI CAFE admin panel.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string; denied?: string }>;
}) {
  const { next, reset, denied } = await searchParams;

  // Already signed in as an admin? Skip the form and go to the dashboard.
  // (A signed-in non-admin just sees the form — they are rejected server-side
  // on submit, never bounced, so there is no redirect loop.)
  const admin = await getCurrentAdmin();
  if (admin) redirect(ADMIN_PATH);

  return <AdminLoginClient next={next} reset={reset === "1"} denied={denied === "1"} />;
}
