import { getCurrentAdmin } from "@/lib/auth";
import { ADMIN_PATH } from "@/lib/constants";
import { redirect } from "next/navigation";
import { AdminLoginClient } from "./AdminLoginClient";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect(ADMIN_PATH);

  return <AdminLoginClient />;
}
