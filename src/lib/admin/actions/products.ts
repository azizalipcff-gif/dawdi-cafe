"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";
import { PRODUCT_STATUSES } from "@/lib/types";
import { revalidateAdmin, isValidId, pickAllowed, dbError } from "./shared";
import { deleteStorageImage, isImageReferencedInTable } from "@/lib/admin/storage";
import { validateProduct } from "./validation";
import { rateLimitAdmin } from "@/lib/rate-limit";

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
    | "status"
    | "sort_order"
    | "translations"
  >
>;

const PRODUCT_FIELDS = [
  "name",
  "description",
  "price",
  "discount",
  "ingredients",
  "image_url",
  "category_id",
  "is_available",
  "is_featured",
  "is_recommended",
  "status",
  "sort_order",
  "translations",
] as const;

export async function createProduct(
  input: ProductInput
): Promise<{ error?: string; data?: Product }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  const parsed = validateProduct(input as Record<string, unknown>, true);
  if (!parsed.ok) return { error: parsed.error };
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert(parsed.value)
    .select()
    .single();
  if (error) return dbError(error);
  revalidateAdmin();
  return { data: data as Product };
}

export async function updateProduct(
  id: string,
  patch: ProductPatch
): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  if (!isValidId(id)) return { error: "Invalid product id." };
  const parsed = validateProduct(patch as Record<string, unknown>, false);
  if (!parsed.ok) return { error: parsed.error };
  const patchClean = parsed.value;
  const supabase = createAdminClient();

  // Only touch Storage when the image field is part of this update.
  const newUrl = (patchClean.image_url as string | null) ?? null;
  let oldUrl: string | null = null;
  if (newUrl !== undefined) {
    const { data: current } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();
    if (!current) return { error: "Product not found." };
    oldUrl = (current?.image_url as string | null) ?? null;
  }

  // Restrict the update to explicitly allowed columns (mass-assignment guard).
  const clean = pickAllowed(patchClean, PRODUCT_FIELDS);

  const { error } = await supabase.from("products").update(clean).eq("id", id);
  if (error) {
    // DB update failed: clean up the just-uploaded orphan (only if it is not
    // already referenced by another record and differs from the previous image).
    if (newUrl && newUrl !== oldUrl) {
      const referenced = await isImageReferencedInTable("products", "image_url", newUrl, id);
      if (!referenced) await deleteStorageImage(newUrl);
    }
    return dbError(error);
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
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "delete");
  if (!isValidId(id)) return { error: "Invalid product id." };
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();
  if (!current) return { error: "Product not found." };
  const url = (current?.image_url as string | null) ?? null;

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return dbError(error);
  revalidateAdmin();

  // Delete the Storage object only after the DB record is gone and no other
  // product references the same image.
  if (url) {
    const referenced = await isImageReferencedInTable("products", "image_url", url);
    if (!referenced) await deleteStorageImage(url);
  }
  return {};
}

// ---------------------------------------------------------------------------
// Moderation / publication status
// ---------------------------------------------------------------------------

// Set a product's moderation status. Used by the admin panel to move a product
// through its lifecycle (draft -> pending -> published, or reject/archive). The
// public site only ever renders `published`; every other state is hidden by RLS
// (products_select_public) and by the public data layer, so this is the single
// authoritative switch for public visibility.
export async function setProductStatus(
  id: string,
  status: Product["status"]
): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "mutation");
  if (!isValidId(id)) return { error: "Invalid product id." };
  if (!PRODUCT_STATUSES.includes(status)) return { error: "Invalid status." };
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) return dbError(error);
  revalidateAdmin();
  return {};
}

export async function publishProduct(id: string) {
  return setProductStatus(id, "published");
}

export async function rejectProduct(id: string) {
  return setProductStatus(id, "rejected");
}

export async function archiveProduct(id: string) {
  return setProductStatus(id, "archived");
}

// Move a product into the moderation queue (hidden from the public site until an
// admin publishes it).
export async function submitProductForReview(id: string) {
  return setProductStatus(id, "pending");
}
