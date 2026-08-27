"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { GalleryItem } from "@/lib/types";
import { revalidateAdmin } from "./shared";
import { deleteStorageImage, isImageReferencedInTable } from "@/lib/admin/storage";

export type GalleryInput = Omit<GalleryItem, "id" | "created_at" | "updated_at">;
export type GalleryPatch = Partial<
  Pick<GalleryItem, "title" | "description" | "image_url" | "category" | "is_featured" | "sort_order" | "is_active" | "translations">
>;

export async function createGalleryItem(
  input: GalleryInput
): Promise<{ error?: string; data?: GalleryItem }> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("gallery").insert(input).select().single();
  if (error) return { error: error.message };
  revalidateAdmin();
  return { data: data as GalleryItem };
}

export async function updateGalleryItem(
  id: string,
  patch: GalleryPatch
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();

  const newUrl = patch.image_url ?? null;
  let oldUrl: string | null = null;
  if (newUrl !== undefined) {
    const { data: current } = await supabase
      .from("gallery")
      .select("image_url")
      .eq("id", id)
      .single();
    oldUrl = (current?.image_url as string | null) ?? null;
  }

  const { error } = await supabase.from("gallery").update(patch).eq("id", id);
  if (error) {
    if (newUrl && newUrl !== oldUrl) {
      const referenced = await isImageReferencedInTable("gallery", "image_url", newUrl, id);
      if (!referenced) await deleteStorageImage(newUrl);
    }
    return { error: error.message };
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
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("gallery").upsert(
    items.map((item) => ({ id: item.id, sort_order: item.sort_order })),
    { onConflict: "id" }
  );
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}

export async function deleteGalleryItem(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("gallery")
    .select("image_url")
    .eq("id", id)
    .single();
  const url = (current?.image_url as string | null) ?? null;

  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();

  if (url) {
    const referenced = await isImageReferencedInTable("gallery", "image_url", url);
    if (!referenced) await deleteStorageImage(url);
  }
  return {};
}
