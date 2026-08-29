import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { AboutPageClient } from "./AboutPageClient";
import StatsServer from "./StatsServer";
import { getBusinessStatistics } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(locale);
  return {
    title: dict.aboutPage.metaTitle,
    description: dict.aboutPage.metaDescription,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const settings = await getSettings(locale);
  const stats = await getBusinessStatistics(locale);
  return (
    <>
      <StatsServer stats={stats} />
      <AboutPageClient settings={settings} stats={stats} />
    </>
  );
}
