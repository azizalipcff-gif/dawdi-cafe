"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateAdmin } from "./shared";

function isValidId(id: string): boolean {
  return typeof id === "string" && id.trim().length > 0;
}

export async function updateTestimonialActive(
  id: string,
  isActive: boolean
): Promise<{ error?: string }> {
  await requireAdmin();
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
  if (error) return { error: error.message };

  revalidateAdmin();
  return {};
}

export async function deleteTestimonial(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  if (!isValidId(id)) return { error: "Invalid testimonial id." };

  const supabase = createAdminClient();

  const { error, count } = await supabase
    .from("testimonials")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return { error: error.message };
  if (count === 0) return { error: "Testimonial not found." };

  revalidateAdmin();
  return {};
}
