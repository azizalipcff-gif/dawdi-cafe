import type { Metadata } from "next";
import { getProducts, getCategories, getSettings } from "@/lib/data";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { MenuPageClient } from "./MenuPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(locale);
  return {
    title: dict.menuPage.metaTitle,
    description: dict.menuPage.metaDescription,
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const [products, categories, settings] = await Promise.all([
    getProducts(false, locale),
    getCategories(true, locale),
    getSettings(locale),
  ]);

  const whatsappNumber = settings.contact?.whatsapp || DEFAULT_SETTINGS.contact.whatsapp;

  return (
    <MenuPageClient
      products={products}
      categories={categories}
      whatsappNumber={whatsappNumber}
    />
  );
}
