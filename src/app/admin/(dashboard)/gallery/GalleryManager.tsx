"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Image as ImageIcon, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { GalleryItem } from "@/lib/types";
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from "@/lib/actions/gallery";

function tr(item: GalleryItem | null, field: string, lang: "fr" | "ar"): string {
  return item?.translations?.[field]?.[lang] ?? "";
}

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<GalleryItem | "new" | null>(null);
  const [isPending] = useTransition();

  const run = async (fn: () => Promise<{ error?: string; success?: boolean }>, msg: string) => {
    const res = await fn();
    if (res?.error) toast.error(res.error);
    else {
      toast.success(msg);
      setEditing(null);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted">{items.length} photos</p>
        <Button onClick={() => setEditing("new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Photo
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted text-center py-16 bg-card border border-border rounded-xl">
          No photos yet. Add your first one!
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden border border-border aspect-square">
            <Image src={item.image_url} alt={item.title ?? "Gallery"} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.title && <p className="text-sm font-medium text-white truncate">{item.title}</p>}
              {item.category && <Badge className="mt-1 bg-white/20 text-white backdrop-blur">{item.category}</Badge>}
            </div>
            {item.is_featured && (
              <Badge variant="default" className="absolute top-2 left-2 bg-brand/90 text-white">Featured</Badge>
            )}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditing(item)}
                className="p-2 rounded-lg bg-black/50 text-white hover:bg-brand"
                aria-label="Edit photo"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => run(() => deleteGalleryItem(item.id), "Photo deleted")}
                className="p-2 rounded-lg bg-black/50 text-white hover:bg-red-500"
                aria-label="Delete photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {!item.is_active && (
              <Badge variant="outline" className="absolute top-2 left-2 bg-white/80 dark:bg-dark/80">Hidden</Badge>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <form
            action={async (formData) => {
              const res = editing === "new"
                ? await createGalleryItem(formData)
                : await updateGalleryItem(editing.id, formData);
              await run(() => Promise.resolve(res ?? { success: true }), editing === "new" ? "Photo added" : "Photo updated");
            }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-dark border border-border p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">
                {editing === "new" ? "Add Photo" : "Edit Photo"}
              </h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1 text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Image *</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center justify-center gap-2 flex-1 p-6 rounded-xl border-2 border-dashed border-border text-sm text-muted cursor-pointer hover:border-brand/40 transition-colors">
                  <Upload className="w-5 h-5" />
                  {editing === "new" ? "Choose image" : "Replace image"}
                  <input type="file" name="image" accept="image/*" className="hidden" />
                </label>
                {editing !== "new" && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image src={editing.image_url} alt={editing.title ?? "Gallery"} fill className="object-cover" sizes="64px" />
                  </div>
                )}
              </div>
              {editing !== "new" && (
                <input type="hidden" name="image_url" value={editing.image_url} />
              )}
              <p className="text-xs text-muted mt-1.5">JPEG, PNG, WebP or GIF · max 8MB</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Title</label>
              <Input name="title" defaultValue={editing === "new" ? "" : (editing.title ?? "")} placeholder="Interior shot" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Title (FR)</label>
                <Input name="title_fr" defaultValue={tr(editing === "new" ? null : editing, "title", "fr")} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Title (AR)</label>
                <Input name="title_ar" defaultValue={tr(editing === "new" ? null : editing, "title", "ar")} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
              <Input name="description" defaultValue={editing === "new" ? "" : (editing.description ?? "")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description (FR)</label>
                <Input name="description_fr" defaultValue={tr(editing === "new" ? null : editing, "description", "fr")} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description (AR)</label>
                <Input name="description_ar" defaultValue={tr(editing === "new" ? null : editing, "description", "ar")} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
              <Input name="category" defaultValue={editing === "new" ? "" : (editing.category ?? "")} placeholder="Interior / Coffee / Crêpes" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Sort Order</label>
              <Input name="sort_order" type="number" defaultValue={editing === "new" ? 0 : editing.sort_order} />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" name="is_featured" defaultChecked={editing !== "new" && editing.is_featured} className="accent-brand" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" name="is_active" defaultChecked={editing === "new" ? true : editing.is_active} className="accent-brand" />
                Visible
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                <ImageIcon className="w-4 h-4" />
                {editing === "new" ? "Upload" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
