"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validation";
import { requireRole } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/storage";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildTranslations(formData: FormData) {
  const translations: Record<string, { en?: string; fr?: string; ar?: string }> = {};
  const pairs: Array<[string, string]> = [
    ["name", "name"],
    ["description", "description"],
  ];
  for (const [field, key] of pairs) {
    const fr = String(formData.get(`${key}_fr`) ?? "").trim();
    const ar = String(formData.get(`${key}_ar`) ?? "").trim();
    if (fr || ar) translations[field] = { fr: fr || undefined, ar: ar || undefined };
  }
  return translations;
}

async function resolveImage(formData: FormData, fallback: string): Promise<string | null> {
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    return uploadImage(file, "categories");
  }
  return fallback || null;
}

export async function createCategory(formData: FormData) {
  await requireRole(["super_admin", "manager"]);

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    sort_order: formData.get("sort_order"),
    is_active: formData.get("is_active") === "on",
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  let imageUrl = parsed.data.image_url || null;
  try {
    imageUrl = await resolveImage(formData, parsed.data.image_url);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const translations = buildTranslations(formData);

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    image_url: imageUrl,
    sort_order: parsed.data.sort_order,
    is_active: parsed.data.is_active,
    translations: Object.keys(translations).length > 0 ? translations : null,
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/menu", "layout");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireRole(["super_admin", "manager"]);

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    sort_order: formData.get("sort_order"),
    is_active: formData.get("is_active") === "on",
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  let imageUrl = parsed.data.image_url || null;
  try {
    imageUrl = await resolveImage(formData, parsed.data.image_url);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const translations = buildTranslations(formData);

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      image_url: imageUrl,
      sort_order: parsed.data.sort_order,
      is_active: parsed.data.is_active,
      translations: Object.keys(translations).length > 0 ? translations : null,
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/menu", "layout");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireRole(["super_admin", "manager"]);

  const supabase = await createClient();
  const { data: existing } = await supabase.from("categories").select("image_url").eq("id", id).maybeSingle();
  if (existing?.image_url) {
    await deleteImage(existing.image_url).catch(() => {});
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/menu", "layout");
  return { success: true };
}
