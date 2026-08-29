"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Star,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { Product, ProductStatus } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ProductImage } from "@/components/ProductImage";

// A product is publicly ready only when it has the minimum data a visitor
// expects: a name, a description, a category, and a price.
function isProductReady(p: Product): boolean {
  return (
    !!p.name &&
    !!p.description &&
    !!p.category_id &&
    p.price !== null &&
    p.price !== undefined
  );
}

interface ProductForm {
  id: string | null;
  name: string;
  description: string;
  price: string;
  discount: string;
  category_id: string;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  status: ProductStatus;
}

const EMPTY_FORM: ProductForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  discount: "",
  category_id: "",
  image_url: null,
  is_available: true,
  is_featured: false,
  status: "pending",
};

const STATUS_OPTIONS: ProductStatus[] = [
  "draft",
  "pending",
  "published",
  "rejected",
  "archived",
];

const STATUS_BADGE: Record<ProductStatus, string> = {
  draft: "border-zinc-500/30 bg-zinc-500/15 text-zinc-300",
  pending: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  published: "border-green-500/30 bg-green-500/15 text-green-400",
  rejected: "border-red-500/30 bg-red-500/15 text-red-400",
  archived: "border-white/10 bg-white/5 text-zinc-400",
};

export default function ProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } =
    useAdminStore();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return (id: string | null) => (id && map.get(id)) || "Uncategorized";
  }, [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
    );
  }, [products, query]);

  const openCreate = () => {
    setForm({
      ...EMPTY_FORM,
      category_id: categories[0]?.id ?? "",
    });
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      discount: product.discount ? String(product.discount) : "",
      category_id: product.category_id ?? "",
      image_url: product.image_url,
      is_available: product.is_available,
      is_featured: product.is_featured,
      status: product.status,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || Number.isNaN(price) || price < 0) return;

    const discount = form.discount.trim() === "" ? 0 : Number(form.discount);
    if (Number.isNaN(discount) || discount < 0) return;

    const base = {
      category_id: form.category_id || null,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price,
      discount,
      image_url: form.image_url,
      is_available: form.is_available,
      is_featured: form.is_featured,
      status: form.status,
      sort_order: products.length + 1,
    };

    if (form.id) {
      updateProduct(form.id, base);
    } else {
      addProduct({ ...base, ingredients: [], is_recommended: false });
    }
    setShowForm(false);
  };

  const changeStatus = (product: Product, status: ProductStatus) => {
    updateProduct(product.id, { status });
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  const toggleAvailability = (product: Product) => {
    updateProduct(product.id, { is_available: !product.is_available });
  };

  const toggleFeatured = (product: Product) => {
    updateProduct(product.id, { is_featured: !product.is_featured });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Products
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {products.length} products · {products.filter((p) => p.is_available).length}{" "}
            available · {products.filter((p) => p.is_featured).length} featured ·{" "}
            <span className="text-amber-400">
              {products.filter((p) => p.status === "pending").length} pending review
            </span>
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr className="text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Availability</th>
                <th className="px-4 py-3 font-medium">Moderation</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                    No products found.
                  </td>
                </tr>
              )}
              {filtered.map((product) => (
                <tr key={product.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                        <ProductImage
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          sizes="44px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-100">{product.name}</p>
                        {product.description && (
                          <p className="max-w-[280px] truncate text-xs text-zinc-500">
                            {product.description}
                          </p>
                        )}
                        <span
                          className={cn(
                            "mt-0.5 inline-block text-[10px] font-semibold",
                            isProductReady(product)
                              ? "text-green-400"
                              : "text-amber-400"
                          )}
                        >
                          {isProductReady(product)
                            ? "Ready to publish"
                            : "Incomplete"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-zinc-300">{categoryName(product.category_id)}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    {formatCurrency(Number(product.price))}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(product)}
                      aria-label="Toggle featured"
                      className={cn(
                        "rounded-full border p-1.5 transition",
                        product.is_featured
                          ? "border-amber-500/40 bg-amber-500/15 text-amber-400"
                          : "border-white/10 text-zinc-600 hover:text-zinc-400"
                      )}
                    >
                      <Star className={cn("h-3.5 w-3.5", product.is_featured && "fill-amber-400")} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAvailability(product)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
                        product.is_available
                          ? "border-green-500/30 bg-green-500/15 text-green-400"
                          : "border-red-500/30 bg-red-500/15 text-red-400"
                      )}
                    >
                      {product.is_available ? "Available" : "Not Available"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={product.status}
                      onChange={(e) =>
                        changeStatus(product, e.target.value as ProductStatus)
                      }
                      className={cn(
                        "rounded-full border bg-transparent px-2.5 py-1 text-[11px] font-semibold outline-none transition",
                        STATUS_BADGE[product.status]
                      )}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-zinc-900 text-zinc-100">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-brand/40 hover:text-brand"
                        aria-label="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                        aria-label="Delete product"
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
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="font-display text-lg font-semibold text-white">
                {form.id ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1.5 text-zinc-400 transition hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <ImageUpload
                label="Product image"
                value={form.image_url}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    placeholder="Product name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Category
                  </label>
                  <select
                    value={form.category_id}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category_id: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand/60"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Price (DH)
                  </label>
                  <input
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Old price (DH, optional)
                  </label>
                  <input
                    value={form.discount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, discount: e.target.value }))
                    }
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-brand/60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Moderation status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value as ProductStatus }))
                    }
                    className={cn(
                      "w-full rounded-xl border bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand/60",
                      STATUS_BADGE[form.status]
                    )}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-zinc-900 text-zinc-100">
                        {s}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-[11px] text-zinc-500">
                    Only &quot;published&quot; products are visible on the public site. Pending, draft,
                    rejected and archived products stay hidden.
                  </p>
                </div>

                <div className="sm:col-span-2">
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
              </div>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                  <span className="text-sm text-zinc-300">Available for order</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.is_available}
                    onClick={() =>
                      setForm((f) => ({ ...f, is_available: !f.is_available }))
                    }
                    className={cn(
                      "relative h-6 w-11 rounded-full transition",
                      form.is_available ? "bg-brand" : "bg-zinc-600"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                        form.is_available ? "left-[22px]" : "left-0.5"
                      )}
                    />
                  </button>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                  <span className="text-sm text-zinc-300">Featured (homepage)</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.is_featured}
                    onClick={() =>
                      setForm((f) => ({ ...f, is_featured: !f.is_featured }))
                    }
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
              </div>

              </div>

              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
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
                  {form.id ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
