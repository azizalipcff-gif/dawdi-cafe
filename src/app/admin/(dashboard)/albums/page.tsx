import { FolderOpen } from "lucide-react";
import { getAlbums } from "@/lib/data";
import { AlbumsManager } from "./AlbumsManager";

export default async function AdminAlbumsPage() {
  const albums = await getAlbums(false);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <FolderOpen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Albums</h1>
          <p className="text-sm text-muted">Group gallery photos into albums</p>
        </div>
      </div>
      <AlbumsManager albums={albums} />
    </div>
  );
}
