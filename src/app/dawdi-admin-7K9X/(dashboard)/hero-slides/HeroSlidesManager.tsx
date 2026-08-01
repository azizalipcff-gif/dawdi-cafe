"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Presentation, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { HeroSlide } from "@/lib/types";
import { createHeroSlide, updateHeroSlide, deleteHeroSlide } from "@/lib/actions/heroSlides";

function tr(slide: HeroSlide | null, field: string, lang: "fr" | "ar"): string {
  return slide?.translations?.[field]?.[lang] ?? "";
}

export function HeroSlidesManager({ slides }: { slides: HeroSlide[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<HeroSlide | "new" | null>(null);
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
        <p className="text-sm text-muted">{slides.length} slides</p>
        <Button onClick={() => setEditing("new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Slide
        </Button>
      </div>

      <div className="space-y-4">
        {slides.length === 0 && (
          <p className="text-sm text-muted text-center py-16 bg-card border border-border rounded-xl">
            No slides yet. Add your first one!
          </p>
        )}
        {slides.map((slide) => (
          <div key={slide.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
            <div className="relative w-28 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
              <Image src={slide.image_url} alt={slide.title} fill className="object-cover" sizes="112px" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">{slide.title}</p>
                {slide.is_active ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="outline">Hidden</Badge>
                )}
              </div>
              <p className="text-xs text-muted truncate">
                {slide.subtitle ?? "No subtitle"} · order {slide.sort_order}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setEditing(slide)} className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => run(() => deleteHeroSlide(slide.id), "Slide deleted")}
                className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <form
            action={async (formData) => {
              const res = editing === "new"
                ? await createHeroSlide(formData)
                : await updateHeroSlide(editing.id, formData);
              await run(() => Promise.resolve(res ?? { success: true }), editing === "new" ? "Slide created" : "Slide updated");
            }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-dark border border-border p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">
                {editing === "new" ? "Add Slide" : "Edit Slide"}
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
                    <Image src={editing.image_url} alt={editing.title} fill className="object-cover" sizes="64px" />
                  </div>
                )}
              </div>
              {editing !== "new" && (
                <input type="hidden" name="image_url" value={editing.image_url} />
              )}
              <p className="text-xs text-muted mt-1.5">JPEG, PNG, WebP or GIF · max 8MB</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Title *</label>
              <Input name="title" defaultValue={editing === "new" ? "" : editing.title} required />
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
              <label className="text-sm font-medium text-foreground block mb-1.5">Subtitle</label>
              <Input name="subtitle" defaultValue={editing === "new" ? "" : (editing.subtitle ?? "")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Subtitle (FR)</label>
                <Input name="subtitle_fr" defaultValue={tr(editing === "new" ? null : editing, "subtitle", "fr")} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Subtitle (AR)</label>
                <Input name="subtitle_ar" defaultValue={tr(editing === "new" ? null : editing, "subtitle", "ar")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Button Label</label>
                <Input name="button_label" defaultValue={editing === "new" ? "" : (editing.button_label ?? "")} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Button URL</label>
                <Input name="button_url" defaultValue={editing === "new" ? "" : (editing.button_url ?? "")} placeholder="/menu" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Overlay Opacity (%)</label>
                <Input name="overlay_opacity" type="number" min="0" max="100" defaultValue={editing === "new" ? 40 : editing.overlay_opacity} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Sort Order</label>
                <Input name="sort_order" type="number" defaultValue={editing === "new" ? 0 : editing.sort_order} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" name="is_active" defaultChecked={editing === "new" ? true : editing.is_active} className="accent-brand" />
              Active (visible on site)
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                <Presentation className="w-4 h-4" />
                {editing === "new" ? "Create" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
