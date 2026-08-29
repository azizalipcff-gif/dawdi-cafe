import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { AboutSection } from "@/components/AboutSection";
import { GallerySection } from "@/components/GallerySection";
import { Testimonials } from "@/components/Testimonials";
import { GoogleMap } from "@/components/GoogleMap";
import { ReservationSection } from "@/components/ReservationSection";
import { ContactSection } from "@/components/ContactSection";
import { getSettings, getGallery, getTestimonials, getHeroSlides, getFeaturedProducts, getBusinessStatistics } from "@/lib/data";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;

  const [settings, gallery, testimonials, heroSlides] = await Promise.all([
    getSettings(locale),
    getGallery(true, locale),
    getTestimonials(true, locale),
    getHeroSlides(true, locale),
  ]);

  const stats = await getBusinessStatistics(locale);

  // The homepage product showcase is driven exclusively by the `is_featured`
  // flag (published + available + featured). The full menu of all public
  // products is available at /menu, so non-featured products must never be
  // rendered here.
  const featured = await getFeaturedProducts(locale);

  return (
    <>
      <Hero settings={settings} slides={heroSlides} />
      <Features />
      <FeaturedProducts products={featured} />
      <AboutSection settings={settings} stats={stats} />
      <GallerySection items={gallery} />
      <Testimonials testimonials={testimonials} />
      <GoogleMap settings={settings} />
      <ReservationSection />
      <ContactSection settings={settings} />
    </>
  );
}
