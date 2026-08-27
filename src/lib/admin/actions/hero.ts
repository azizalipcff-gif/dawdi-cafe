"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { HeroSlide } from "@/lib/types";
import { revalidateAdmin } from "./shared";
import { deleteStorageImage, isImageReferencedInTable } from "@/lib/admin/storage";

export type HeroInput = Omit<HeroSlide, "id" | "created_at" | "updated_at">;
export type HeroPatch = Partial<
  Pick<HeroSlide, "title" | "subtitle" | "image_url" | "button_label" | "button_url" | "overlay_opacity" | "sort_order" | "is_active" | "translations">
>;

export async function createHeroSlide(
  input: HeroInput
): Promise<{ error?: string; data?: HeroSlide }> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("hero_slides").insert(input).select().single();
  if (error) return { error: error.message };
  revalidateAdmin();
  return { data: data as HeroSlide };
}

export async function updateHeroSlide(
  id: string,
  patch: HeroPatch
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();

  const newUrl = patch.image_url ?? null;
  let oldUrl: string | null = null;
  if (newUrl !== undefined) {
    const { data: current } = await supabase
      .from("hero_slides")
      .select("image_url")
      .eq("id", id)
      .single();
    oldUrl = (current?.image_url as string | null) ?? null;
  }

  const { error } = await supabase.from("hero_slides").update(patch).eq("id", id);
  if (error) {
    if (newUrl && newUrl !== oldUrl) {
      const referenced = await isImageReferencedInTable("hero_slides", "image_url", newUrl, id);
      if (!referenced) await deleteStorageImage(newUrl);
    }
    return { error: error.message };
  }
  revalidateAdmin();

  if (newUrl !== undefined && oldUrl && oldUrl !== newUrl) {
    const referenced = await isImageReferencedInTable("hero_slides", "image_url", oldUrl, id);
    if (!referenced) await deleteStorageImage(oldUrl);
  }
  return {};
}

export async function reorderHeroSlides(
  items: { id: string; sort_order: number }[]
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("hero_slides").upsert(
    items.map((item) => ({ id: item.id, sort_order: item.sort_order })),
    { onConflict: "id" }
  );
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}

export async function deleteHeroSlide(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("hero_slides")
    .select("image_url")
    .eq("id", id)
    .single();
  const url = (current?.image_url as string | null) ?? null;

  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();

  if (url) {
    const referenced = await isImageReferencedInTable("hero_slides", "image_url", url);
    if (!referenced) await deleteStorageImage(url);
  }
  return {};
}
