"use server";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { HeroSlide } from "@/lib/types";
import { revalidateAdmin } from "./shared";

export type HeroInput = Omit<HeroSlide, "id" | "created_at" | "updated_at">;
export type HeroPatch = Partial<
  Pick<HeroSlide, "title" | "subtitle" | "image_url" | "button_label" | "button_url" | "overlay_opacity" | "sort_order" | "is_active" | "translations">
>;

export async function createHeroSlide(
  input: HeroInput
): Promise<{ error?: string; data?: HeroSlide }> {
  await requireAdmin();
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}

export async function reorderHeroSlides(
  items: { id: string; sort_order: number }[]
): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAdmin();
  return {};
}
