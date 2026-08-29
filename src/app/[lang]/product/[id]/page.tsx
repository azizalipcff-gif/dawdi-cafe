import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts, getSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { ProductDetail } from "@/components/ProductDetail";

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const product = await getProductById(id, locale);

  // Unpublished / missing products must not be indexed or exposed.
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  const description = product.description ?? undefined;
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { lang, id } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;

  const product = await getProductById(id, locale);
  // Unpublished, pending, rejected, archived, or deleted products resolve to
  // null here and render a proper 404 — they are never shown publicly.
  if (!product) notFound();

  const [related, settings] = await Promise.all([
    getRelatedProducts(product.category_id, product.id, locale),
    getSettings(locale),
  ]);

  const dict = getDictionary(locale);
  const businessName = settings.cafe?.name || DEFAULT_SETTINGS.cafe.name;
  const whatsappNumber = settings.contact?.whatsapp || DEFAULT_SETTINGS.contact.whatsapp;

  return (
    <ProductDetail
      product={product}
      related={related}
      dict={dict}
      locale={locale}
      businessName={businessName}
      whatsappNumber={whatsappNumber}
    />
  );
}
