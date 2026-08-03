"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Star,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface ItemForm {
  id: string | null;
  title: string;
  description: string;
  category: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

const EMPTY_FORM: ItemForm = {
  id: null,
  title: "",
  description: "",
  category: "",
  image_url: "",
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

export default function GalleryPage() {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, reorderGallery } =
    useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ItemForm>(EMPTY_FORM);

  const sorted = useMemo(
    () => [...gallery].sort((a, b) => a.sort_order - b.sort_order),
    [gallery]
  );

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, sort_order: (sorted.length + 1) * 10 });
    setShowForm(true);
  };

  const openEdit = (item: GalleryItem) => {
    setForm({
      id: item.id,
      title: item.title ?? "",
      description: item.description ?? "",
      category: item.category ?? "",
      image_url: item.image_url,
      is_featured: item.is_featured,
      is_active: item.is_active,
      sort_order: item.sort_order,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) return;

    if (form.id) {
      updateGalleryItem(form.id, {
        title: form.title.trim() || null,
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        image_url: form.image_url,
        is_featured: form.is_featured,
        is_active: form.is_active,
        sort_order: form.sort_order,
      });
    } else {
      addGalleryItem({
        title: form.title.trim() || null,
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        image_url: form.image_url,
        is_featured: form.is_featured,
        is_active: form.is_active,
        sort_order: form.sort_order,
      });
    }
    setShowForm(false);
  };

  const handleDelete = (item: GalleryItem) => {
    if (window.confirm(`Delete this image${item.title ? ` ("${item.title}")` : ""}?`)) {
      deleteGalleryItem(item.id);
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    reorderGallery(next.map((g, i) => ({ id: g.id, sort_order: (i + 1) * 10 })));
  };

  const toggleActive = (item: GalleryItem) => {
    updateGalleryItem(item.id, { is_active: !item.is_active });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Gallery Manager
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {gallery.length} images · {gallery.filter((g) => g.is_active).length} visible
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          Add Image
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <p className="text-sm text-zinc-500">No images yet. Upload your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]",
                !item.is_active && "opacity-60"
              )}
            >
              <div className="relative aspect-square">
                <Image
                  src={item.image_url}
                  alt={item.title ?? "Gallery image"}
                  width={400}
                  height={400}
                  unoptimized
                  className="h-full w-full object-cover"
                />
                {item.is_featured && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <Star className="h-3 w-3 fill-white" />
                    Featured
                  </span>
                )}
              </div>

              <div className="p-3">
                <p className="truncate text-sm font-medium text-zinc-100">
                  {item.title || "Untitled"}
                </p>
                {item.category && (
                  <p className="truncate text-xs text-zinc-500">{item.category}</p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="rounded-lg border border-white/10 p-1.5 text-zinc-400 transition hover:text-brand disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === sorted.length - 1}
                      className="rounded-lg border border-white/10 p-1.5 text-zinc-400 transition hover:text-brand disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleActive(item)}
                      className={cn(
                        "rounded-lg border px-2 py-1 text-[10px] font-semibold transition",
                        item.is_active
                          ? "border-green-500/30 bg-green-500/15 text-green-400"
                          : "border-zinc-600/40 bg-zinc-500/10 text-zinc-400"
                      )}
                    >
                      {item.is_active ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="rounded-lg border border-white/10 p-1.5 text-zinc-400 transition hover:border-brand/40 hover:text-brand"
                      aria-label="Edit image"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="rounded-lg border border-white/10 p-1.5 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                      aria-label="Delete image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="font-display text-lg font-semibold text-white">
                {form.id ? "Edit Image" : "Add Image"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1.5 text-zinc-400 transition hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              <ImageUpload
                label="Image"
                value={form.image_url || null}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url ?? "" }))}
              />

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Image title"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Category
                  </label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="e.g. Drinks, Interior"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Sort order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand/60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Optional description"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                />
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                <span className="text-sm text-zinc-300">Featured</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.is_featured}
                  onClick={() => setForm((f) => ({ ...f, is_featured: !f.is_featured }))}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition",
                    form.is_featured ? "bg-amber-500" : "bg-zinc-600"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                      form.is_featured ? "left-[22px]" : "left-0.5"
                    )}
                  />
                </button>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                <span className="text-sm text-zinc-300">Visible on the site</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.is_active}
                  onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition",
                    form.is_active ? "bg-brand" : "bg-zinc-600"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                      form.is_active ? "left-[22px]" : "left-0.5"
                    )}
                  />
                </button>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!form.image_url}
                  className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:opacity-50"
                >
                  {form.id ? "Save Changes" : "Add Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
