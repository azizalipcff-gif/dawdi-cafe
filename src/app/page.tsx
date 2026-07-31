import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { MenuSection } from "@/components/MenuSection";
import { AboutSection } from "@/components/AboutSection";
import { GallerySection } from "@/components/GallerySection";
import { Testimonials } from "@/components/Testimonials";
import { GoogleMap } from "@/components/GoogleMap";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <MenuSection />
      <AboutSection />
      <GallerySection />
      <Testimonials />
      <GoogleMap />
      <ContactSection />
    </>
  );
}
