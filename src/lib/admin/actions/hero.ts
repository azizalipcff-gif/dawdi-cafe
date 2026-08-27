"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { HeroSlide } from "@/lib/types";
import { revalidateAdmin, isValidId, pickAllowed, dbError } from "./shared";
import { deleteStorageImage, isImageReferencedInTable } from "@/lib/admin/storage";
import { validateHeroSlide } from "./validation";
import { rateLimitAdmin } from "@/lib/rate-limit";

export type HeroInput = Omit<HeroSlide, "id" | "created_at" | "updated_at">;
export type HeroPatch = Partial<
  Pick<HeroSlide, "title" | "subtitle" | "image_url" | "button_label" | "button_url" | "overlay_opacity" | "sort_order" | "is_active" | "translations">
>;

const HERO_FIELDS = [
  "title",
  "subtitle",
  "image_url",
  "button_label",
  "button_url",
  "overlay_opacity",
  "sort_order",
  "is_active",
  "translations",
] as const;

export async function createHeroSlide(
  input: HeroInput
): Promise<{ error?: string; data?: HeroSlide }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  const parsed = validateHeroSlide(input as Record<string, unknown>, true);
  if (!parsed.ok) return { error: parsed.error };
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("hero_slides").insert(parsed.value).select().single();
  if (error) return dbError(error);
  revalidateAdmin();
  return { data: data as HeroSlide };
}

export async function updateHeroSlide(
  id: string,
  patch: HeroPatch
): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id);
  if (!isValidId(id)) return { error: "Invalid hero slide id." };
  const parsed = validateHeroSlide(patch as Record<string, unknown>, false);
  if (!parsed.ok) return { error: parsed.error };
  const patchClean = parsed.value;
  const supabase = createAdminClient();

  const newUrl = (patchClean.image_url as string | null) ?? null;
  let oldUrl: string | null = null;
  if (newUrl !== undefined) {
    const { data: current } = await supabase
      .from("hero_slides")
      .select("image_url")
      .eq("id", id)
      .single();
    if (!current) return { error: "Hero slide not found." };
    oldUrl = (current?.image_url as string | null) ?? null;
  }

  const clean = pickAllowed(patchClean, HERO_FIELDS);

  const { error } = await supabase.from("hero_slides").update(clean).eq("id", id);
  if (error) {
    if (newUrl && newUrl !== oldUrl) {
      const referenced = await isImageReferencedInTable("hero_slides", "image_url", newUrl, id);
      if (!referenced) await deleteStorageImage(newUrl);
    }
    return dbError(error);
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
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "bulk");
  if (!Array.isArray(items)) return { error: "Invalid payload." };
  for (const item of items) {
    if (!isValidId(item?.id)) return { error: "Invalid hero slide id." };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("hero_slides").upsert(
    items.map((item) => ({ id: item.id, sort_order: item.sort_order })),
    { onConflict: "id" }
  );
  if (error) return dbError(error);
  revalidateAdmin();
  return {};
}

export async function deleteHeroSlide(id: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  await rateLimitAdmin(admin.id, "delete");
  if (!isValidId(id)) return { error: "Invalid hero slide id." };
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("hero_slides")
    .select("image_url")
    .eq("id", id)
    .single();
  if (!current) return { error: "Hero slide not found." };
  const url = (current?.image_url as string | null) ?? null;

  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return dbError(error);
  revalidateAdmin();

  if (url) {
    const referenced = await isImageReferencedInTable("hero_slides", "image_url", url);
    if (!referenced) await deleteStorageImage(url);
  }
  return {};
}
