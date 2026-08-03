"use server";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/lib/types";
import { revalidateAdmin } from "./shared";

export type GalleryInput = Omit<GalleryItem, "id" | "created_at" | "updated_at">;
export type GalleryPatch = Partial<
  Pick<GalleryItem, "title" | "description" | "image_url" | "category" | "is_featured" | "sort_order" | "is_active" | "translations">
>;

export async function createGalleryItem(
  input: GalleryInput
): Promise<{ error?: string; data?: GalleryItem }> {
  await requireAdmin();
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { error } = await supabase.from("gallery").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}

// Persist a full re-ordered list (sort_order values only).
export async function reorderGallery(
  items: { id: string; sort_order: number }[]
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}
