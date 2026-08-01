"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { testimonialSchema } from "@/lib/validation";
import { requireRole } from "@/lib/auth";

export async function createTestimonial(formData: FormData) {
  await requireRole(["super_admin", "manager"]);

  const parsed = testimonialSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    rating: formData.get("rating"),
    content: formData.get("content"),
    is_active: formData.get("is_active") === "on",
    sort_order: formData.get("sort_order"),
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").insert({
    ...parsed.data,
    role: parsed.data.role || null,
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireRole(["super_admin", "manager"]);

  const parsed = testimonialSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    rating: formData.get("rating"),
    content: formData.get("content"),
    is_active: formData.get("is_active") === "on",
    sort_order: formData.get("sort_order"),
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ ...parsed.data, role: parsed.data.role || null })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  await requireRole(["super_admin", "manager"]);

  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
