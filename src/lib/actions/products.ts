"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validation";
import { requireRole } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/storage";

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

export async function createProduct(formData: FormData) {
  await requireRole(["super_admin", "manager"]);

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    category_id: formData.get("category_id") || null,
    price: formData.get("price"),
    discount: formData.get("discount"),
    ingredients: formData.get("ingredients"),
    image_url: formData.get("image_url"),
    is_available: formData.get("is_available") === "on",
    is_featured: formData.get("is_featured") === "on",
    is_recommended: formData.get("is_recommended") === "on",
    sort_order: formData.get("sort_order"),
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const file = formData.get("image") as File | null;
  let imageUrl = parsed.data.image_url || null;
  if (file && file.size > 0) {
    try {
      imageUrl = await uploadImage(file, "products");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  const translations = buildTranslations(formData);
  if (Object.keys(translations).length > 0) {
    // Merge with any raw JSON passed from the form.
    const rawTranslations = parsed.data.translations ?? {};
    Object.assign(rawTranslations, translations);
    rawTranslations["name"] = { ...(rawTranslations["name"] ?? {}), ...translations["name"] };
    rawTranslations["description"] = {
      ...(rawTranslations["description"] ?? {}),
      ...translations["description"],
    };
    Object.assign(translations, rawTranslations);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    name: parsed.data.name,
    description: parsed.data.description || null,
    category_id: parsed.data.category_id || null,
    price: parsed.data.price,
    discount: parsed.data.discount,
    ingredients: parsed.data.ingredients,
    image_url: imageUrl,
    is_available: parsed.data.is_available,
    is_featured: parsed.data.is_featured,
    is_recommended: parsed.data.is_recommended,
    sort_order: parsed.data.sort_order,
    translations: Object.keys(translations).length > 0 ? translations : null,
  });

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/menu", "layout");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireRole(["super_admin", "manager"]);

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    category_id: formData.get("category_id") || null,
    price: formData.get("price"),
    discount: formData.get("discount"),
    ingredients: formData.get("ingredients"),
    image_url: formData.get("image_url"),
    is_available: formData.get("is_available") === "on",
    is_featured: formData.get("is_featured") === "on",
    is_recommended: formData.get("is_recommended") === "on",
    sort_order: formData.get("sort_order"),
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const file = formData.get("image") as File | null;
  let imageUrl = parsed.data.image_url || null;
  if (file && file.size > 0) {
    try {
      imageUrl = await uploadImage(file, "products");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  const translations = buildTranslations(formData);
  if (Object.keys(translations).length > 0) {
    const rawTranslations = parsed.data.translations ?? {};
    Object.assign(rawTranslations, translations);
    rawTranslations["name"] = { ...(rawTranslations["name"] ?? {}), ...translations["name"] };
    rawTranslations["description"] = {
      ...(rawTranslations["description"] ?? {}),
      ...translations["description"],
    };
    Object.assign(translations, rawTranslations);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      category_id: parsed.data.category_id || null,
      price: parsed.data.price,
      discount: parsed.data.discount,
      ingredients: parsed.data.ingredients,
      image_url: imageUrl,
      is_available: parsed.data.is_available,
      is_featured: parsed.data.is_featured,
      is_recommended: parsed.data.is_recommended,
      sort_order: parsed.data.sort_order,
      translations: Object.keys(translations).length > 0 ? translations : null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/menu", "layout");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireRole(["super_admin", "manager"]);

  const supabase = await createClient();

  const { data: existing } = await supabase.from("products").select("image_url").eq("id", id).maybeSingle();
  if (existing?.image_url) {
    await deleteImage(existing.image_url).catch(() => {});
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/menu", "layout");
  return { success: true };
}

export async function toggleProductAvailability(id: string, available: boolean) {
  await requireRole(["super_admin", "manager", "employee"]);
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ is_available: available }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function toggleProductRecommended(id: string, recommended: boolean) {
  await requireRole(["super_admin", "manager"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_recommended: recommended })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/menu", "layout");
  return { success: true };
}

export async function setProductSortOrder(id: string, sortOrder: number) {
  await requireRole(["super_admin", "manager"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ sort_order: Math.max(0, Math.floor(sortOrder)) })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/menu", "layout");
  return { success: true };
}

export async function duplicateProduct(id: string) {
  await requireRole(["super_admin", "manager"]);

  const supabase = await createClient();
  const { data: source, error: selectError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (selectError || !source) return { error: selectError?.message ?? "Product not found" };

  const { error } = await supabase.from("products").insert({
    category_id: source.category_id,
    name: `${source.name} (copy)`,
    description: source.description,
    price: source.price,
    discount: source.discount ?? 0,
    ingredients: source.ingredients ?? [],
    image_url: source.image_url,
    is_available: source.is_available,
    is_featured: source.is_featured,
    is_recommended: source.is_recommended,
    sort_order: (source.sort_order ?? 0) + 1,
    translations: source.translations ?? null,
  });

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/menu", "layout");
  return { success: true };
}
