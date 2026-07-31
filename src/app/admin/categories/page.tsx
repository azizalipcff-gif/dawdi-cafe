"use client";

import { FolderTree, Plus, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["Coffee", "Tea", "Fresh Juice", "Milkshake", "Smoothies", "Crêpes", "Pancakes", "Desserts"];

export default function AdminCategoriesPage() {
  return (
    <AdminPageShell title="Categories" subtitle="Manage menu categories" icon={<FolderTree className="w-5 h-5" />}>
      <div className="mb-6">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-brand/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                <FolderTree className="w-5 h-5" />
              </div>
              <span className="font-medium text-foreground">{cat}</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand/10 transition-colors"><Edit3 className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
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
