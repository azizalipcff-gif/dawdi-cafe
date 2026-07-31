"use client";

import { useState } from "react";
import { Package, Plus, Search, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const initialProducts = [
  { id: 1, name: "Espresso", category: "Coffee", price: "15 MAD", stock: "In Stock" },
  { id: 2, name: "Cappuccino", category: "Coffee", price: "25 MAD", stock: "In Stock" },
  { id: 3, name: "Nutella Crêpe", category: "Crêpes", price: "35 MAD", stock: "In Stock" },
  { id: 4, name: "Orange Juice", category: "Juices", price: "22 MAD", stock: "Low Stock" },
  { id: 5, name: "Chocolate Milkshake", category: "Milkshakes", price: "32 MAD", stock: "Out of Stock" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  return (
    <AdminPageShell title="Products" subtitle="Manage your menu products" icon={<Package className="w-5 h-5" />}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left p-4 font-medium text-muted">Name</th>
                <th className="text-left p-4 font-medium text-muted">Category</th>
                <th className="text-left p-4 font-medium text-muted">Price</th>
                <th className="text-left p-4 font-medium text-muted">Stock</th>
                <th className="text-right p-4 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{product.name}</td>
                  <td className="p-4 text-muted">{product.category}</td>
                  <td className="p-4 text-foreground font-mono">{product.price}</td>
                  <td className="p-4">
                    <Badge variant={product.stock === "In Stock" ? "default" : product.stock === "Low Stock" ? "outline" : "destructive"}>
                      {product.stock}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
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
    </AdminPageShell>
  );
}

function AdminPageShell({ children, title, subtitle, icon }: { children: React.ReactNode; title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">{icon}</div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
