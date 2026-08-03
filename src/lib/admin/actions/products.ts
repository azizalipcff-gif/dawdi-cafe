"use server";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { revalidateAdmin } from "./shared";

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at" | "category">;
export type ProductPatch = Partial<
  Pick<
    Product,
    | "name"
    | "description"
    | "price"
    | "discount"
    | "ingredients"
    | "image_url"
    | "category_id"
    | "is_available"
    | "is_featured"
    | "is_recommended"
    | "sort_order"
    | "translations"
  >
>;

export async function createProduct(
  input: ProductInput
): Promise<{ error?: string; data?: Product }> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...input,
      ingredients: input.ingredients ?? [],
      discount: input.discount ?? 0,
    })
    .select()
    .single();
  if (error) return { error: error.message };
  revalidateAdmin();
  return { data: data as Product };
}

export async function updateProduct(
  id: string,
  patch: ProductPatch
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}
