"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";
import { revalidateAdmin } from "./shared";
import { deleteStorageImage, isImageReferencedInTable } from "@/lib/admin/storage";

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
  const supabase = createAdminClient();
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
  const supabase = createAdminClient();

  // Only touch Storage when the image field is part of this update.
  const newUrl = patch.image_url ?? null;
  let oldUrl: string | null = null;
  if (newUrl !== undefined) {
    const { data: current } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();
    oldUrl = (current?.image_url as string | null) ?? null;
  }

  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) {
    // DB update failed: clean up the just-uploaded orphan (only if it is not
    // already referenced by another record and differs from the previous image).
    if (newUrl && newUrl !== oldUrl) {
      const referenced = await isImageReferencedInTable("products", "image_url", newUrl, id);
      if (!referenced) await deleteStorageImage(newUrl);
    }
    return { error: error.message };
  }
  revalidateAdmin();

  // After a successful update: remove the previous image if it was replaced and
  // no other product still references it. The DB now points at the new URL.
  if (newUrl !== undefined && oldUrl && oldUrl !== newUrl) {
    const referenced = await isImageReferencedInTable("products", "image_url", oldUrl, id);
    if (!referenced) await deleteStorageImage(oldUrl);
  }
  return {};
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();
  const url = (current?.image_url as string | null) ?? null;

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();

  // Delete the Storage object only after the DB record is gone and no other
  // product references the same image.
  if (url) {
    const referenced = await isImageReferencedInTable("products", "image_url", url);
    if (!referenced) await deleteStorageImage(url);
  }
  return {};
}
