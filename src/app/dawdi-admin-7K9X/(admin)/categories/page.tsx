"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryForm {
  id: string | null;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: CategoryForm = {
  id: null,
  name: "",
  slug: "",
  description: "",
  sort_order: 0,
  is_active: true,
};

export default function CategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } =
    useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);

  const countFor = (id: string) => products.filter((p) => p.category_id === id).length;

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, sort_order: categories.length + 1 });
    setShowForm(true);
  };

  const openEdit = (category: Category) => {
    setForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    const slug =
      form.slug.trim() ||
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    if (form.id) {
      updateCategory(form.id, {
        name,
        slug,
        description: form.description.trim() || null,
        sort_order: form.sort_order,
        is_active: form.is_active,
      });
    } else {
      addCategory({
        name,
        slug,
        description: form.description.trim() || null,
        image_url: null,
        sort_order: form.sort_order,
        is_active: form.is_active,
      });
    }
    setShowForm(false);
  };

  const handleDelete = (category: Category) => {
    const count = countFor(category.id);
    const message =
      count > 0
        ? `Delete "${category.name}"? Its ${count} product(s) will become uncategorized.`
        : `Delete "${category.name}"?`;
    if (window.confirm(message)) {
      deleteCategory(category.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Categories
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {categories.length} categories ·{" "}
            {categories.filter((c) => c.is_active).length} active
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03]">
            <tr className="text-xs uppercase tracking-wider text-zinc-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  No categories yet.
                </td>
              </tr>
            )}
            {categories.map((category) => (
              <tr key={category.id} className="transition hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-100">{category.name}</p>
                  {category.description && (
                    <p className="max-w-[320px] truncate text-xs text-zinc-500">
                      {category.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                  {category.slug}
                </td>
                <td className="px-4 py-3 text-zinc-300">{countFor(category.id)}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                      category.is_active
                        ? "border-green-500/30 bg-green-500/15 text-green-400"
                        : "border-zinc-600/40 bg-zinc-500/10 text-zinc-400"
                    )}
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(category)}
                      className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-brand/40 hover:text-brand"
                      aria-label="Edit category"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                      aria-label="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                {form.id ? "Edit Category" : "Add Category"}
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
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="Category name"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Slug
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="auto-generated"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Sort order
                  </label>
                  <input
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sort_order: Number(e.target.value) || 0,
                      }))
                    }
                    type="number"
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  placeholder="Short description"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                />
              </div>

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
                  className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
                >
                  {form.id ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
