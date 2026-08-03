"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Layout,
  Check,
  Save,
  UtensilsCrossed,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface SlideForm {
  id: string | null;
  title: string;
  subtitle: string;
  image_url: string;
  button_label: string;
  button_url: string;
  overlay_opacity: number;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_SLIDE: SlideForm = {
  id: null,
  title: "",
  subtitle: "",
  image_url: "",
  button_label: "",
  button_url: "",
  overlay_opacity: 40,
  sort_order: 0,
  is_active: true,
};

export default function HomepagePage() {
  const { heroSlides, settings, addHeroSlide, updateHeroSlide, deleteHeroSlide, reorderHeroSlides, updateSettings } =
    useAdminStore();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SlideForm>(EMPTY_SLIDE);

  const [about, setAbout] = useState({
    name: settings.cafe.name,
    tagline: settings.cafe.tagline,
    description: settings.cafe.description,
  });
  const [savedAbout, setSavedAbout] = useState(false);

  const sorted = useMemo(
    () => [...heroSlides].sort((a, b) => a.sort_order - b.sort_order),
    [heroSlides]
  );

  const openCreate = () => {
    setForm({ ...EMPTY_SLIDE, sort_order: (sorted.length + 1) * 10 });
    setShowForm(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setForm({
      id: slide.id,
      title: slide.title,
      subtitle: slide.subtitle ?? "",
      image_url: slide.image_url,
      button_label: slide.button_label ?? "",
      button_url: slide.button_url ?? "",
      overlay_opacity: slide.overlay_opacity,
      sort_order: slide.sort_order,
      is_active: slide.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image_url) return;

    if (form.id) {
      updateHeroSlide(form.id, {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        image_url: form.image_url,
        button_label: form.button_label.trim() || null,
        button_url: form.button_url.trim() || null,
        overlay_opacity: form.overlay_opacity,
        sort_order: form.sort_order,
        is_active: form.is_active,
      });
    } else {
      addHeroSlide({
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        image_url: form.image_url,
        button_label: form.button_label.trim() || null,
        button_url: form.button_url.trim() || null,
        overlay_opacity: form.overlay_opacity,
        sort_order: form.sort_order,
        is_active: form.is_active,
      });
    }
    setShowForm(false);
  };

  const handleDelete = (slide: HeroSlide) => {
    if (window.confirm(`Delete hero slide "${slide.title}"?`)) {
      deleteHeroSlide(slide.id);
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    reorderHeroSlides(next.map((s, i) => ({ id: s.id, sort_order: (i + 1) * 10 })));
  };

  const toggleActive = (slide: HeroSlide) => {
    updateHeroSlide(slide.id, { is_active: !slide.is_active });
  };

  const saveAbout = () => {
    updateSettings({ cafe: { ...about } });
    setSavedAbout(true);
    window.setTimeout(() => setSavedAbout(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">
          Homepage Control
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Hero slides and about section shown on the homepage.
        </p>
      </div>

      {/* Hero slides */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <Layout className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-white">Hero Slides</h2>
              <p className="text-xs text-zinc-500">
                Rotating banners at the top of the homepage.
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" />
            Add Slide
          </button>
        </div>

        {sorted.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500">
            No hero slides. The homepage falls back to a static intro.
          </p>
        ) : (
          <div className="space-y-3">
            {sorted.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "flex flex-col gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:flex-row sm:items-center",
                  !slide.is_active && "opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="rounded border border-white/10 p-1 text-zinc-400 transition hover:text-brand disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === sorted.length - 1}
                      className="rounded border border-white/10 p-1 text-zinc-400 transition hover:text-brand disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10">
                    {slide.image_url && (
                      <Image
                        src={slide.image_url}
                        alt={slide.title}
                        width={112}
                        height={64}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-100">{slide.title}</p>
                  {slide.subtitle && (
                    <p className="truncate text-xs text-zinc-500">{slide.subtitle}</p>
                  )}
                  {slide.button_label && (
                    <p className="mt-0.5 text-xs text-brand">
                      {slide.button_label} → {slide.button_url || "/"}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(slide)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
                      slide.is_active
                        ? "border-green-500/30 bg-green-500/15 text-green-400"
                        : "border-zinc-600/40 bg-zinc-500/10 text-zinc-400"
                    )}
                  >
                    {slide.is_active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => openEdit(slide)}
                    className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-brand/40 hover:text-brand"
                    aria-label="Edit slide"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide)}
                    className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                    aria-label="Delete slide"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About section */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <Layout className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-white">About Section</h2>
            <p className="text-xs text-zinc-500">
              Text displayed in the homepage About section.
            </p>
          </div>
        </div>

        <div className="grid max-w-2xl grid-cols-1 gap-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Cafe name
            </label>
            <input
              value={about.name}
              onChange={(e) => setAbout((a) => ({ ...a, name: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Tagline
            </label>
            <input
              value={about.tagline}
              onChange={(e) => setAbout((a) => ({ ...a, tagline: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Description
            </label>
            <textarea
              value={about.description}
              onChange={(e) => setAbout((a) => ({ ...a, description: e.target.value }))}
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand/60"
            />
          </div>
          <div className="flex items-center gap-3">
            {savedAbout && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
            <button
              onClick={saveAbout}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
            >
              <Save className="h-4 w-4" />
              Save About
            </button>
          </div>
        </div>
      </section>

      {/* Menu note */}
      <section className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
          <UtensilsCrossed className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-white">Menu Control</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Everything on the menu page comes straight from the database — products,
            categories, prices and availability.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/dawdi-admin-7K9X/products"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-brand/40 hover:text-brand"
            >
              Manage Products →
            </Link>
            <Link
              href="/dawdi-admin-7K9X/categories"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-brand/40 hover:text-brand"
            >
              Manage Categories →
            </Link>
          </div>
        </div>
      </section>

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
                {form.id ? "Edit Slide" : "Add Slide"}
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
                label="Background image"
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
                  required
                  placeholder="Hero title"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Subtitle
                </label>
                <textarea
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  rows={2}
                  placeholder="Short supporting line"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Button label
                  </label>
                  <input
                    value={form.button_label}
                    onChange={(e) => setForm((f) => ({ ...f, button_label: e.target.value }))}
                    placeholder="Explore the Menu"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Button URL
                  </label>
                  <input
                    value={form.button_url}
                    onChange={(e) => setForm((f) => ({ ...f, button_url: e.target.value }))}
                    placeholder="/menu"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Overlay opacity (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.overlay_opacity}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        overlay_opacity: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand/60"
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

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                <span className="text-sm text-zinc-300">Active (shown on homepage)</span>
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
                  disabled={!form.title.trim() || !form.image_url}
                  className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:opacity-50"
                >
                  {form.id ? "Save Changes" : "Add Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
