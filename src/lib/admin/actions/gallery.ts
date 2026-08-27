"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { GalleryItem } from "@/lib/types";
import { revalidateAdmin, isValidId, pickAllowed, dbError } from "./shared";
import { deleteStorageImage, isImageReferencedInTable } from "@/lib/admin/storage";
import { validateGalleryItem } from "./validation";
import { rateLimitAdmin } from "@/lib/rate-limit";

export type GalleryInput = Omit<GalleryItem, "id" | "created_at" | "updated_at">;
export type GalleryPatch = Partial<
  Pick<GalleryItem, "title" | "description" | "image_url" | "category" | "is_featured" | "sort_order" | "is_active" | "translations">
>;

const GALLERY_FIELDS = [
  "title",
  "description",
  "image_url",
  "category",
  "is_featured",
  "sort_order",
  "is_active",
  "translations",
] as const;

export async function createGalleryItem(
  input: GalleryInput
): Promise<{ error?: string; data?: GalleryItem }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  const parsed = validateGalleryItem(input as Record<string, unknown>, true);
  if (!parsed.ok) return { error: parsed.error };
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("gallery").insert(parsed.value).select().single();
  if (error) return dbError(error);
  revalidateAdmin();
  return { data: data as GalleryItem };
}

export async function updateGalleryItem(
  id: string,
  patch: GalleryPatch
): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  if (!isValidId(id)) return { error: "Invalid gallery item id." };
  const parsed = validateGalleryItem(patch as Record<string, unknown>, false);
  if (!parsed.ok) return { error: parsed.error };
  const patchClean = parsed.value;
  const supabase = createAdminClient();

  const newUrl = (patchClean.image_url as string | null) ?? null;
  let oldUrl: string | null = null;
  if (newUrl !== undefined) {
    const { data: current } = await supabase
      .from("gallery")
      .select("image_url")
      .eq("id", id)
      .single();
    if (!current) return { error: "Gallery item not found." };
    oldUrl = (current?.image_url as string | null) ?? null;
  }

  const clean = pickAllowed(patchClean, GALLERY_FIELDS);

  const { error } = await supabase.from("gallery").update(clean).eq("id", id);
  if (error) {
    if (newUrl && newUrl !== oldUrl) {
      const referenced = await isImageReferencedInTable("gallery", "image_url", newUrl, id);
      if (!referenced) await deleteStorageImage(newUrl);
    }
    return dbError(error);
  }
  revalidateAdmin();

  if (newUrl !== undefined && oldUrl && oldUrl !== newUrl) {
    const referenced = await isImageReferencedInTable("gallery", "image_url", oldUrl, id);
    if (!referenced) await deleteStorageImage(oldUrl);
  }
  return {};
}

// Persist a full re-ordered list (sort_order values only).
export async function reorderGallery(
  items: { id: string; sort_order: number }[]
): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "bulk");
  if (!Array.isArray(items)) return { error: "Invalid payload." };
  for (const item of items) {
    if (!isValidId(item?.id)) return { error: "Invalid gallery item id." };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("gallery").upsert(
    items.map((item) => ({ id: item.id, sort_order: item.sort_order })),
    { onConflict: "id" }
  );
  if (error) return dbError(error);
  revalidateAdmin();
  return {};
}

export async function deleteGalleryItem(id: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "delete");
  if (!isValidId(id)) return { error: "Invalid gallery item id." };
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("gallery")
    .select("image_url")
    .eq("id", id)
    .single();
  if (!current) return { error: "Gallery item not found." };
  const url = (current?.image_url as string | null) ?? null;

  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return dbError(error);
  revalidateAdmin();

  if (url) {
    const referenced = await isImageReferencedInTable("gallery", "image_url", url);
    if (!referenced) await deleteStorageImage(url);
  }
  return {};
}
