import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { MenuSection } from "@/components/MenuSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { AboutSection } from "@/components/AboutSection";
import { GallerySection } from "@/components/GallerySection";
import { Testimonials } from "@/components/Testimonials";
import { GoogleMap } from "@/components/GoogleMap";
import { ReservationSection } from "@/components/ReservationSection";
import { ContactSection } from "@/components/ContactSection";
import { getSettings, getProducts, getCategories, getGallery, getTestimonials, getHeroSlides, getFeaturedProducts, getBusinessStatistics } from "@/lib/data";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;

  const [settings, products, categories, gallery, testimonials, heroSlides] = await Promise.all([
    getSettings(locale),
    getProducts(true, locale),
    getCategories(true, locale),
    getGallery(true, locale),
    getTestimonials(true, locale),
    getHeroSlides(true, locale),
  ]);

  const stats = await getBusinessStatistics(locale);

  // Featured products shown on homepage should be explicitly fetched to
  // respect the `is_featured` flag and avoid rendering non-featured items.
  const featured = await getFeaturedProducts(locale);

  return (
    <>
      <Hero settings={settings} slides={heroSlides} />
      <Features />
      <FeaturedProducts products={featured} />
      <MenuSection products={products} categories={categories} />
      <AboutSection settings={settings} stats={stats} />
      <GallerySection items={gallery} />
      <Testimonials testimonials={testimonials} />
      <GoogleMap settings={settings} />
      <ReservationSection />
      <ContactSection settings={settings} />
    </>
  );
}
