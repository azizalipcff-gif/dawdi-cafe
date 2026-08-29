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
  BusinessStatistic,
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
  const rows = ((data ?? []) as Category[]).map((row) => ({
    ...row,
    name: localize(row.name, row.translations, "name", locale) ?? row.name,
    description: localize(row.description, row.translations, "description", locale),
  }));
  return rows;
}

function normalizeProduct(locale: Locale) {
  return (row: Product): Product => ({
    ...row,
    status: (row.status as Product["status"]) ?? "published",
    name: localize(row.name, row.translations, "name", locale) ?? row.name,
    description: localize(row.description, row.translations, "description", locale),
    category: row.category
      ? {
          ...row.category,
          name: localize(row.category.name, row.category.translations, "name", locale) ?? row.category.name,
          description: localize(row.category.description, row.category.translations, "description", locale),
        }
      : null,
  });
}

export async function getProducts(
  activeOnly = true,
  locale: Locale = defaultLocale
): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("sort_order");
  if (activeOnly) query = query.eq("is_available", true);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return ((data ?? []) as Product[]).map(normalizeProduct(locale));
}

export async function getFeaturedProducts(
  locale: Locale = defaultLocale
): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("is_featured", true)
    .eq("is_available", true)
    .order("sort_order")
    .limit(8);
  if (error) {
    console.error(error);
    return [];
  }
  return ((data ?? []) as Product[]).map(normalizeProduct(locale));
}

// Public, single-product lookup used by the product detail page. Only returns a
// product when it is explicitly published — unpublished/pending/rejected/archived
// products resolve to null and the page renders a 404. RLS (products_select_public)
// provides a second layer of enforcement for anonymous readers.
export async function getProductById(
  id: string,
  locale: Locale = defaultLocale
): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return normalizeProduct(locale)(data as Product);
}

// Published products in the same category, excluding the current one. Used for
// the "you might also like" section. Status filter guarantees unpublished
// products never leak into the public detail page.
export async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string,
  locale: Locale = defaultLocale,
  limit = 4
): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .neq("id", excludeId)
    .order("sort_order")
    .limit(limit);
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return ((data ?? []) as Product[]).map(normalizeProduct(locale));
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

export async function getBusinessStatistics(
  locale: Locale = defaultLocale
): Promise<BusinessStatistic[]> {
  const supabase = await createClient();
  void locale;
  // Only return active statistics to public readers
  const { data } = await supabase.from("business_statistics").select("*").eq("is_active", true).order("sort_order");
  const rows = (data ?? []) as BusinessStatistic[];

  // If the products statistic requests a real count, fetch it and replace
  const needsProductsCount = rows.some((r) => r.use_real_count && r.key === "products");
  if (needsProductsCount) {
    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_available", true);
    const productCount = typeof count === "number" ? count : 0;
    for (const row of rows) {
      if (row.key === "products" && row.use_real_count) {
        row.value = `${productCount}+`;
      }
    }
  }

  // Sensible defaults: if no rows defined, return a minimal set so frontend
  // doesn't break on empty DB.
  if (rows.length === 0) {
    return [
      { id: "", key: "daily_customers", label: "Daily Customers", value: "200+", description: null, use_real_count: false, sort_order: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "", key: "products", label: "Products", value: "50+", description: null, use_real_count: false, sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "", key: "years_experience", label: "Years of Experience", value: "4+", description: null, use_real_count: false, sort_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "", key: "quality_care", label: "Quality & Care", value: "100%", description: null, use_real_count: false, sort_order: 3, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ];
  }

  return rows.map((r) => ({ ...r }));
}

