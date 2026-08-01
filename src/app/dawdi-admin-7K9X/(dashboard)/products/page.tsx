import { Package } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data";
import { ProductsManager } from "./ProductsManager";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(false), getCategories(false)]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted">Manage your menu products</p>
        </div>
      </div>
      <ProductsManager products={products} categories={categories} />
    </div>
  );
}
