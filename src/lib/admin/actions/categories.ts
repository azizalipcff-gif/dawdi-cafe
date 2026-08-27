"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Category } from "@/lib/types";
import { revalidateAdmin, isValidId, pickAllowed, dbError } from "./shared";
import { validateCategory } from "./validation";
import { rateLimitAdmin } from "@/lib/rate-limit";

export type CategoryInput = Omit<Category, "id" | "created_at" | "updated_at">;
export type CategoryPatch = Partial<
  Pick<Category, "name" | "slug" | "description" | "image_url" | "sort_order" | "is_active" | "translations">
>;

const CATEGORY_FIELDS = [
  "name",
  "slug",
  "description",
  "image_url",
  "sort_order",
  "is_active",
  "translations",
] as const;

export async function createCategory(
  input: CategoryInput
): Promise<{ error?: string; data?: Category }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  const parsed = validateCategory(input as Record<string, unknown>, true);
  if (!parsed.ok) return { error: parsed.error };
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("categories").insert(parsed.value).select().single();
  if (error) return dbError(error);
  revalidateAdmin();
  return { data: data as Category };
}

export async function updateCategory(
  id: string,
  patch: CategoryPatch
): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  if (!isValidId(id)) return { error: "Invalid category id." };
  const parsed = validateCategory(patch as Record<string, unknown>, false);
  if (!parsed.ok) return { error: parsed.error };
  const patchClean = parsed.value;
  const supabase = createAdminClient();
  const clean = pickAllowed(patchClean, CATEGORY_FIELDS);
  const { error } = await supabase.from("categories").update(clean).eq("id", id);
  if (error) return dbError(error);
  revalidateAdmin();
  return {};
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "delete");
  if (!isValidId(id)) return { error: "Invalid category id." };
  const supabase = createAdminClient();
  const { error, count } = await supabase
    .from("categories")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return dbError(error);
  if (count === 0) return { error: "Category not found." };
  revalidateAdmin();
  return {};
}
