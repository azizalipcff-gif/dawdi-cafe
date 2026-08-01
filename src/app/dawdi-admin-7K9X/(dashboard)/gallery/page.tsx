import { Image as ImageIcon } from "lucide-react";
import { getGallery } from "@/lib/data";
import { GalleryManager } from "./GalleryManager";

export default async function AdminGalleryPage() {
  const items = await getGallery(false);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <ImageIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Gallery</h1>
          <p className="text-sm text-muted">Manage the photo gallery</p>
        </div>
      </div>
      <GalleryManager items={items} />
    </div>
  );
}
