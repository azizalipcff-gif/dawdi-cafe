"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FolderTree, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Category } from "@/lib/types";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";

function tr(cat: Category | "new", field: string, lang: "fr" | "ar"): string {
  return cat === "new" ? "" : (cat.translations?.[field]?.[lang] ?? "");
}

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | "new" | null>(null);
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
        <p className="text-sm text-muted">{categories.length} categories</p>
        <Button onClick={() => setEditing("new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left p-4 font-medium text-muted">Name</th>
                <th className="text-left p-4 font-medium text-muted">Slug</th>
                <th className="text-left p-4 font-medium text-muted">Sort</th>
                <th className="text-left p-4 font-medium text-muted">Active</th>
                <th className="text-right p-4 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">No categories yet.</td>
                </tr>
              )}
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {cat.image_url ? (
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0">
                          <Image src={cat.image_url} alt={cat.name} fill className="object-cover" sizes="36px" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                          <FolderTree className="w-4 h-4" />
                        </div>
                      )}
                      <span className="font-medium text-foreground">{cat.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted font-mono text-xs">{cat.slug}</td>
                  <td className="p-4 text-muted">{cat.sort_order}</td>
                  <td className="p-4">
                    {cat.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="outline">Hidden</Badge>}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(cat)} className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => run(() => deleteCategory(cat.id), "Category deleted")}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <form
            action={async (formData) => {
              const res = editing === "new"
                ? await createCategory(formData)
                : await updateCategory(editing.id, formData);
              await run(() => Promise.resolve(res ?? { success: true }), editing === "new" ? "Category created" : "Category updated");
            }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-dark border border-border p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">
                {editing === "new" ? "Add Category" : "Edit Category"}
              </h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1 text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Name *</label>
              <Input name="name" defaultValue={editing === "new" ? "" : editing.name} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Name (FR)</label>
                <Input name="name_fr" defaultValue={tr(editing, "name", "fr")} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Name (AR)</label>
                <Input name="name_ar" defaultValue={tr(editing, "name", "ar")} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Slug (auto-generated if empty)</label>
              <Input name="slug" defaultValue={editing === "new" ? "" : editing.slug} placeholder="coffee" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
              <Input name="description" defaultValue={editing === "new" ? "" : (editing.description ?? "")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description (FR)</label>
                <Input name="description_fr" defaultValue={tr(editing, "description", "fr")} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description (AR)</label>
                <Input name="description_ar" defaultValue={tr(editing, "description", "ar")} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Image</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-sm text-muted cursor-pointer hover:border-brand/40 transition-colors">
                  <Upload className="w-4 h-4" />
                  {editing !== "new" && editing.image_url ? "Replace image" : "Upload image"}
                  <input type="file" name="image" accept="image/*" className="hidden" />
                </label>
                {editing !== "new" && editing.image_url && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image src={editing.image_url} alt={editing.name} fill className="object-cover" sizes="48px" />
                  </div>
                )}
              </div>
              {editing !== "new" && editing.image_url && (
                <input type="hidden" name="image_url" value={editing.image_url} />
              )}
              <p className="text-xs text-muted mt-1.5">JPEG, PNG, WebP or GIF · max 8MB</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Sort Order</label>
              <Input name="sort_order" type="number" defaultValue={editing === "new" ? 0 : editing.sort_order} />
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" name="is_active" defaultChecked={editing === "new" ? true : editing.is_active} className="accent-brand" />
              Active (visible on site)
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                <FolderTree className="w-4 h-4" />
                {editing === "new" ? "Create" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
