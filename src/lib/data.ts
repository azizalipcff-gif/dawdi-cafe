import { createClient } from "@/lib/supabase/server";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import type {
  Category,
  Product,
  GalleryItem,
  Testimonial,
  SiteSettings,
  HeroSlide,
  Album,
  Translations,
} from "@/lib/types";

function localize(
  value: string | null | undefined,
  translations: Translations | null | undefined,
  field: string,
  locale: Locale
): string | null {
  const translated = translations?.[field]?.[locale];
  if (translated && translated.trim()) return translated;
  return value ?? null;
}

export async function getSettings(locale: Locale = defaultLocale): Promise<Partial<SiteSettings>> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value, value_fr, value_ar");

  const result: Partial<SiteSettings> = {};
  for (const row of data ?? []) {
    const value = { ...(row.value ?? {}) } as Record<string, unknown>;
    if (locale !== defaultLocale) {
      const localized = locale === "fr" ? row.value_fr : row.value_ar;
      if (localized && typeof localized === "object") {
        for (const [k, v] of Object.entries(localized as Record<string, unknown>)) {
          if (v !== null && v !== "" && v !== undefined) value[k] = v;
        }
      }
    }
    result[row.key as keyof SiteSettings] = value as never;
  }
  return result;
}

export async function getCategories(
  activeOnly = true,
  locale: Locale = defaultLocale
): Promise<Category[]> {
  const supabase = await createClient();
  let query = supabase.from("categories").select("*").order("sort_order");
  if (activeOnly) query = query.eq("is_active", true);
  const { data } = await query;
  return ((data ?? []) as Category[]).map((row) => ({
    ...row,
    name: localize(row.name, row.translations, "name", locale) ?? row.name,
    description: localize(row.description, row.translations, "description", locale),
  }));
}

export async function getProducts(
  activeOnly = true,
  locale: Locale = defaultLocale
): Promise<Product[]> {  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("sort_order");
  if (activeOnly) query = query.eq("is_available", true);
  const { data } = await query;
  return ((data ?? []) as Product[]).map((row) => ({
    ...row,
    name: localize(row.name, row.translations, "name", locale) ?? row.name,
    description: localize(row.description, row.translations, "description", locale),
    category: row.category
      ? {
          ...row.category,
          name: localize(row.category.name, row.category.translations, "name", locale) ?? row.category.name,
          description: localize(row.category.description, row.category.translations, "description", locale),
        }
      : null,
  }));
}

export async function getFeaturedProducts(
  locale: Locale = defaultLocale
): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_featured", true)
    .eq("is_available", true)
    .order("sort_order")
    .limit(8);
  return ((data ?? []) as Product[]).map((row) => ({
    ...row,
    name: localize(row.name, row.translations, "name", locale) ?? row.name,
    description: localize(row.description, row.translations, "description", locale),
    category: row.category
      ? {
          ...row.category,
          name: localize(row.category.name, row.category.translations, "name", locale) ?? row.category.name,
          description: localize(row.category.description, row.category.translations, "description", locale),
        }
      : null,
  }));
}

export async function getGallery(
  activeOnly = true,
  locale: Locale = defaultLocale
): Promise<GalleryItem[]> {
  const supabase = await createClient();
  let query = supabase.from("gallery").select("*").order("sort_order");
  if (activeOnly) query = query.eq("is_active", true);
  const { data } = await query;
  return ((data ?? []) as GalleryItem[]).map((row) => ({
    ...row,
    title: localize(row.title, row.translations, "title", locale),
    description: localize(row.description, row.translations, "description", locale),
    category: localize(row.category, row.translations, "category", locale),
  }));
}

export async function getTestimonials(
  activeOnly = true,
  locale: Locale = defaultLocale
): Promise<Testimonial[]> {
  const supabase = await createClient();
  let query = supabase.from("testimonials").select("*").order("sort_order");
  if (activeOnly) query = query.eq("is_active", true);
  const { data } = await query;
  return ((data ?? []) as Testimonial[]).map((row) => ({
    ...row,
    role: localize(row.role, row.translations, "role", locale),
    content: localize(row.content, row.translations, "content", locale) ?? row.content,
  }));
}

export async function getHeroSlides(
  activeOnly = true,
  locale: Locale = defaultLocale
): Promise<HeroSlide[]> {
  const supabase = await createClient();
  let query = supabase.from("hero_slides").select("*").order("sort_order");
  if (activeOnly) query = query.eq("is_active", true);
  const { data } = await query;
  return ((data ?? []) as HeroSlide[]).map((row) => ({
    ...row,
    title: localize(row.title, row.translations, "title", locale) ?? row.title,
    subtitle: localize(row.subtitle, row.translations, "subtitle", locale),
    button_label: localize(row.button_label, row.translations, "button_label", locale),
  }));
}

export async function getAlbums(
  activeOnly = true,
  locale: Locale = defaultLocale
): Promise<Album[]> {
  const supabase = await createClient();
  let query = supabase.from("albums").select("*").order("sort_order");
  if (activeOnly) query = query.eq("is_active", true);
  const { data } = await query;
  return ((data ?? []) as Album[]).map((row) => ({
    ...row,
    name: localize(row.name, row.translations, "name", locale) ?? row.name,
    description: localize(row.description, row.translations, "description", locale),
  }));
}

