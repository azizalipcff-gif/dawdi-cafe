"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { gallerySchema } from "@/lib/validation";
import { requireRole } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/storage";

function buildTranslations(formData: FormData) {
  const translations: Record<string, { en?: string; fr?: string; ar?: string }> = {};
  const pairs: Array<[string, string]> = [
    ["title", "title"],
    ["description", "description"],
    ["category", "category"],
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
    return uploadImage(file, "gallery");
  }
  return fallback;
}

export async function createGalleryItem(formData: FormData) {
  await requireRole(["super_admin", "manager"]);

  let imageUrl = String(formData.get("image_url") ?? "");
  try {
    imageUrl = await resolveImage(formData, imageUrl);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = gallerySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    image_url: imageUrl,
    category: formData.get("category"),
    is_featured: formData.get("is_featured") === "on",
    is_active: formData.get("is_active") === "on",
    sort_order: formData.get("sort_order"),
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const translations = buildTranslations(formData);

  const supabase = await createClient();
  const { error } = await supabase.from("gallery").insert({
    ...parsed.data,
    title: parsed.data.title || null,
    description: parsed.data.description || null,
    category: parsed.data.category || null,
    translations: Object.keys(translations).length > 0 ? translations : null,
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/gallery", "layout");
  return { success: true };
}

export async function updateGalleryItem(id: string, formData: FormData) {
  await requireRole(["super_admin", "manager"]);

  let imageUrl = String(formData.get("image_url") ?? "");
  try {
    imageUrl = await resolveImage(formData, imageUrl);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = gallerySchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    image_url: imageUrl,
    category: formData.get("category"),
    is_featured: formData.get("is_featured") === "on",
    is_active: formData.get("is_active") === "on",
    sort_order: formData.get("sort_order"),
  });

  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const translations = buildTranslations(formData);

  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery")
    .update({
      ...parsed.data,
      title: parsed.data.title || null,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      translations: Object.keys(translations).length > 0 ? translations : null,
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/gallery", "layout");
  return { success: true };
}

export async function deleteGalleryItem(id: string) {
  await requireRole(["super_admin", "manager"]);

  const supabase = await createClient();
  const { data: existing } = await supabase.from("gallery").select("image_url").eq("id", id).maybeSingle();
  if (existing?.image_url) {
    await deleteImage(existing.image_url).catch(() => {});
  }

  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/gallery", "layout");
  return { success: true };
}
