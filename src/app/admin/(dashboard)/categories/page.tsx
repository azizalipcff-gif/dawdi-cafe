import { FolderTree } from "lucide-react";
import { getCategories } from "@/lib/data";
import { CategoriesManager } from "./CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await getCategories(false);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <FolderTree className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted">Organize your menu sections</p>
        </div>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}
