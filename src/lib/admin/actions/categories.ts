"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Category } from "@/lib/types";
import { revalidateAdmin } from "./shared";

export type CategoryInput = Omit<Category, "id" | "created_at" | "updated_at">;
export type CategoryPatch = Partial<
  Pick<Category, "name" | "slug" | "description" | "image_url" | "sort_order" | "is_active" | "translations">
>;

export async function createCategory(
  input: CategoryInput
): Promise<{ error?: string; data?: Category }> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("categories").insert(input).select().single();
  if (error) return { error: error.message };
  revalidateAdmin();
  return { data: data as Category };
}

export async function updateCategory(
  id: string,
  patch: CategoryPatch
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}
