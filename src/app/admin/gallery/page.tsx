"use client";

import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const galleryItems = [
  { id: 1, title: "Coffee Art", category: "Coffee" },
  { id: 2, title: "Cozy Corner", category: "Interior" },
  { id: 3, title: "Fresh Crêpes", category: "Food" },
  { id: 4, title: "Espresso Shot", category: "Coffee" },
  { id: 5, title: "Outdoor Terrace", category: "Interior" },
  { id: 6, title: "Dessert Display", category: "Food" },
];

export default function AdminGalleryPage() {
  const deleteItem = () => {
    toast.success("Image removed from gallery");
  };

  return (
    <AdminPageShell title="Gallery" subtitle="Manage gallery images" icon={<ImageIcon className="w-5 h-5" />}>
      <div className="mb-6">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Images
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {galleryItems.map((item) => (
          <div key={item.id} className="group relative aspect-square rounded-xl bg-gradient-to-br from-brand/10 via-dark/10 to-brand/5 border border-border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
            <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={deleteItem} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-xs font-medium text-white bg-dark/60 rounded-lg px-2 py-1 text-center backdrop-blur-sm">{item.title}</p>
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
