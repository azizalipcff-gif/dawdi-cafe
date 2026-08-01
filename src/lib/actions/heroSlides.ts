"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { heroSlideSchema } from "@/lib/validation";
import { requireRole } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/storage";

function buildTranslations(formData: FormData) {
  const translations: Record<string, { en?: string; fr?: string; ar?: string }> = {};
  const pairs: Array<[string, string]> = [
    ["title", "title"],
    ["subtitle", "subtitle"],
    ["button_label", "button_label"],
  ];
  for (const [field, key] of pairs) {
    const fr = String(formData.get(`${key}_fr`) ?? "").trim();
    const ar = String(formData.get(`${key}_ar`) ?? "").trim();
    if (fr || ar) translations[field] = { fr: fr || undefined, ar: ar || undefined };
  }
  return translations;
}

async function resolveImage(formData: FormData, fallback: string): Promise<string> {
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    return uploadImage(file, "hero");
  }
  return fallback;
}

export async function createHeroSlide(formData: FormData) {
  await requireRole(["super_admin", "manager"]);

  let imageUrl = String(formData.get("image_url") ?? "");
  try {
    imageUrl = await resolveImage(formData, imageUrl);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = heroSlideSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    image_url: imageUrl,
    button_label: formData.get("button_label"),
    button_url: formData.get("button_url"),
    overlay_opacity: formData.get("overlay_opacity"),
    sort_order: formData.get("sort_order"),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const translations = buildTranslations(formData);

  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").insert({
    ...parsed.data,
    subtitle: parsed.data.subtitle || null,
    button_label: parsed.data.button_label || null,
    button_url: parsed.data.button_url || null,
    translations: Object.keys(translations).length > 0 ? translations : null,
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateHeroSlide(id: string, formData: FormData) {
  await requireRole(["super_admin", "manager"]);

  let imageUrl = String(formData.get("image_url") ?? "");
  try {
    imageUrl = await resolveImage(formData, imageUrl);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = heroSlideSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    image_url: imageUrl,
    button_label: formData.get("button_label"),
    button_url: formData.get("button_url"),
    overlay_opacity: formData.get("overlay_opacity"),
    sort_order: formData.get("sort_order"),
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const translations = buildTranslations(formData);

  const supabase = await createClient();
  const { error } = await supabase
    .from("hero_slides")
    .update({
      ...parsed.data,
      subtitle: parsed.data.subtitle || null,
      button_label: parsed.data.button_label || null,
      button_url: parsed.data.button_url || null,
      translations: Object.keys(translations).length > 0 ? translations : null,
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteHeroSlide(id: string) {
  await requireRole(["super_admin", "manager"]);

  const supabase = await createClient();
  const { data: existing } = await supabase.from("hero_slides").select("image_url").eq("id", id).maybeSingle();
  if (existing?.image_url) {
    await deleteImage(existing.image_url).catch(() => {});
  }

  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
