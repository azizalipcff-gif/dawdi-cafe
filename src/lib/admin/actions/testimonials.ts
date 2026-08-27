"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateAdmin, isValidId, dbError } from "./shared";
import { rateLimitAdmin } from "@/lib/rate-limit";

export async function updateTestimonialActive(
  id: string,
  isActive: boolean
): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  if (!isValidId(id)) return { error: "Invalid testimonial id." };

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("testimonials")
    .select("id")
    .eq("id", id)
    .single();
  if (!existing) return { error: "Testimonial not found." };

  const { error } = await supabase
    .from("testimonials")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return dbError(error);

  revalidateAdmin();
  return {};
}

export async function deleteTestimonial(id: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "delete");
  if (!isValidId(id)) return { error: "Invalid testimonial id." };

  const supabase = createAdminClient();

  const { error, count } = await supabase
    .from("testimonials")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return dbError(error);
  if (count === 0) return { error: "Testimonial not found." };

  revalidateAdmin();
  return {};
}
