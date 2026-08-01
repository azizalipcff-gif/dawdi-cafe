"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminUserSchema } from "@/lib/validation";
import { requireRole } from "@/lib/auth";

// Super Admin only: invite a new admin user
export async function createAdminUser(formData: FormData) {
  await requireRole(["super_admin"]);

  const parsed = adminUserSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const admin = createAdminClient();

  const { data: existing, error: lookupError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (lookupError) return { error: lookupError.message };

  let userId = existing?.users.find((u) => u.email?.toLowerCase() === parsed.data.email.toLowerCase())?.id;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: parsed.data.email,
      password,
      email_confirm: true,
    });
    if (error) return { error: error.message };
    userId = data.user.id;
  }

  const { error } = await admin.from("admins").upsert(
    { user_id: userId, role: parsed.data.role },
    { onConflict: "user_id" }
  );
  if (error) return { error: error.message };

  revalidatePath("/admin/users", "layout");
  return { success: true };
}

// Super Admin only: update an admin role
export async function updateAdminRole(userId: string, role: string) {
  await requireRole(["super_admin"]);

  if (!["super_admin", "manager", "employee"].includes(role)) {
    return { error: "Invalid role" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("admins").update({ role }).eq("user_id", userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/users", "layout");
  return { success: true };
}

// Super Admin only: suspend or reactivate an admin
export async function toggleAdminSuspended(userId: string, suspended: boolean) {
  await requireRole(["super_admin"]);

  const admin = createAdminClient();
  const { error } = await admin.from("admins").update({ is_suspended: suspended }).eq("user_id", userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/users", "layout");
  return { success: true };
}

// Super Admin only: remove an admin
export async function deleteAdminUser(userId: string) {
  await requireRole(["super_admin"]);

  const admin = createAdminClient();
  const { error } = await admin.from("admins").delete().eq("user_id", userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/users", "layout");
  return { success: true };
}

// Server-side public helper used by contact/reservation pages to get settings
export async function getPublicSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value");
  return (data ?? []).reduce<Record<string, unknown>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}
