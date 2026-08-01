"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Package, Plus, Search, Pencil, Trash2, Copy, ToggleLeft, ToggleRight, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Product, Category } from "@/lib/types";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  toggleProductAvailability,
  toggleProductRecommended,
} from "@/lib/actions/products";
import { formatCurrency } from "@/lib/utils";

interface ProductsManagerProps {
  products: Product[];
  categories: Category[];
}

type Editing = { id: string } | "new" | null;

function translationValue(product: Product | null, field: string, lang: "fr" | "ar"): string {
  return product?.translations?.[field]?.[lang] ?? "";
}

export function ProductsManager({ products, categories }: ProductsManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Editing>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async (action: () => Promise<{ error?: string; success?: boolean }>) => {
    const res = await action();
    if (res?.error) toast.error(res.error);
    else {
      toast.success("Saved");
      setEditing(null);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setEditing("new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left p-4 font-medium text-muted">Product</th>
                <th className="text-left p-4 font-medium text-muted">Category</th>
                <th className="text-left p-4 font-medium text-muted">Price</th>
                <th className="text-left p-4 font-medium text-muted">Discount</th>
                <th className="text-left p-4 font-medium text-muted">Rec.</th>
                <th className="text-left p-4 font-medium text-muted">Featured</th>
                <th className="text-left p-4 font-medium text-muted">Available</th>
                <th className="text-right p-4 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted">
                    No products found.
                  </td>
                </tr>
              )}
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="40px" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                      )}
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted">{product.category?.name ?? "—"}</td>
                  <td className="p-4 text-foreground font-mono">{formatCurrency(product.price)}</td>
                  <td className="p-4">
                    {product.discount && Number(product.discount) > 0 ? (
                      <Badge variant="destructive">-{formatCurrency(product.discount)}</Badge>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        startTransition(() => handleAction(() => toggleProductRecommended(product.id, !product.is_recommended)))
                      }
                      disabled={isPending}
                      aria-label="Toggle recommended"
                      className={product.is_recommended ? "text-brand" : "text-muted"}
                    >
                      {product.is_recommended ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="p-4">{product.is_featured && <Badge variant="default">Featured</Badge>}</td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        startTransition(() => handleAction(() => toggleProductAvailability(product.id, !product.is_available)))
                      }
                      disabled={isPending}
                      className={product.is_available ? "text-green-600" : "text-muted"}
                      aria-label="Toggle availability"
                    >
                      {product.is_available ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startTransition(() => handleAction(() => duplicateProduct(product.id)))}
                        disabled={isPending}
                        title="Duplicate"
                        className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditing({ id: product.id })} className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction(() => deleteProduct(product.id))}
                        className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <ProductFormModal
          product={editing === "new" ? null : products.find((p) => p.id === editing.id) ?? null}
          categories={categories}
          onClose={() => setEditing(null)}
          onSubmit={async (formData) => {
            const res = editing === "new"
              ? await createProduct(formData)
              : await updateProduct(editing.id, formData);
            if (res?.error) toast.error(res.error);
            else {
              toast.success(editing === "new" ? "Product created" : "Product updated");
              setEditing(null);
              router.refresh();
            }
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  product,
  categories,
  onClose,
  onSubmit,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form
        action={onSubmit}
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-dark border border-border p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-foreground">
            {product ? "Edit Product" : "Add Product"}
          </h3>
          <button type="button" onClick={onClose} className="p-1 text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Name *</label>
          <Input name="name" defaultValue={product?.name} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Name (FR)</label>
            <Input name="name_fr" defaultValue={translationValue(product, "name", "fr")} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Name (AR)</label>
            <Input name="name_ar" defaultValue={translationValue(product, "name", "ar")} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            rows={2}
            className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Short description"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Description (FR)</label>
            <textarea
              name="description_fr"
              defaultValue={translationValue(product, "description", "fr")}
              rows={2}
              className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Description (AR)</label>
            <textarea
              name="description_ar"
              defaultValue={translationValue(product, "description", "ar")}
              rows={2}
              className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand"
              dir="rtl"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Price (MAD) *</label>
            <Input name="price" type="number" step="0.01" min="0" defaultValue={product?.price ?? ""} required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Discount (MAD)</label>
            <Input name="discount" type="number" step="0.01" min="0" defaultValue={product?.discount ?? 0} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Sort Order</label>
            <Input name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Ingredients (comma separated)</label>
          <Input name="ingredients" defaultValue={(product?.ingredients ?? []).join(", ")} placeholder="Milk, sugar, cinnamon" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Image</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-sm text-muted cursor-pointer hover:border-brand/40 transition-colors">
              <Upload className="w-4 h-4" />
              {product?.image_url ? "Replace image" : "Upload image"}
              <input type="file" name="image" accept="image/*" className="hidden" />
            </label>
            {product?.image_url && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="48px" />
              </div>
            )}
          </div>
          {product?.image_url && (
            <input type="hidden" name="image_url" value={product.image_url} />
          )}
          <p className="text-xs text-muted mt-1.5">JPEG, PNG, WebP or GIF · max 8MB</p>
        </div>
        <div className="flex gap-6 flex-wrap">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="is_available" defaultChecked={product?.is_available ?? true} className="accent-brand" />
            Available
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} className="accent-brand" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="is_recommended" defaultChecked={product?.is_recommended ?? false} className="accent-brand" />
            Recommended
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="gap-2">
            <Package className="w-4 h-4" />
            {product ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
