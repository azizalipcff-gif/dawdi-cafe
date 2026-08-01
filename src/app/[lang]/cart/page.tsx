import type { Metadata } from "next";
import { CartPageClient } from "@/components/CartPageClient";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

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

export default function CartPage() {
  return <CartPageClient />;
}
