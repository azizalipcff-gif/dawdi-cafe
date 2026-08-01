import { Presentation } from "lucide-react";
import { getHeroSlides } from "@/lib/data";
import { HeroSlidesManager } from "./HeroSlidesManager";

export default async function AdminHeroSlidesPage() {
  const slides = await getHeroSlides(false);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <Presentation className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Hero Slides</h1>
          <p className="text-sm text-muted">Manage the homepage carousel</p>
        </div>
      </div>
      <HeroSlidesManager slides={slides} />
    </div>
  );
}
