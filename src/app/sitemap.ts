import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { locales } from "@/lib/i18n/config";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/menu", "/about", "/gallery", "/contact"];

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "monthly" : "weekly",
      priority: route === "" ? 1 : 0.8,
    }))
  );

  // Only published products get a public, indexable URL. Unpublished/pending/
  // rejected/archived products are intentionally omitted.
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("products")
      .select("id, updated_at")
      .eq("status", "published");
    productEntries = (data ?? []).flatMap((p) =>
      locales.map((locale) => ({
        url: `${SITE_URL}/${locale}/product/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      }))
    );
  } catch {
    // If the database is unreachable at build time, skip product URLs rather
    // than failing the build.
  }

  return [...staticEntries, ...productEntries];
}
