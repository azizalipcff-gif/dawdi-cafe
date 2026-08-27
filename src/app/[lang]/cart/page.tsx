import type { Metadata } from "next";
import { CartPageClient } from "@/components/CartPageClient";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSettings } from "@/lib/data";
import { DEFAULT_SETTINGS } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(locale);
  return {
    title: dict.cart.metaTitle,
    description: dict.cart.metaDescription,
  };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const settings = await getSettings(locale);
  const whatsappNumber = settings.contact?.whatsapp || DEFAULT_SETTINGS.contact.whatsapp;

  return <CartPageClient whatsappNumber={whatsappNumber} />;
}
