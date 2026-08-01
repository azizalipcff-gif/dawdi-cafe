"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Product, Category } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { fmt } from "@/lib/i18n/config";

interface MenuPageClientProps {
  products: Product[];
  categories: Category[];
}

export function MenuPageClient({ products, categories }: MenuPageClientProps) {
  const { addItem } = useCart();
  const { dict } = useI18n();
  const [search, setSearch] = useState("");

  const activeCategories = categories.filter((c) => c.is_active);

  const grouped = activeCategories
    .map((cat) => ({
      category: cat,
      items: products.filter(
        (p) =>
          p.category_id === cat.id &&
          (p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.description ?? "").toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter((g) => g.items.length > 0);

  const uncategorized = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !(p.description ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    return !p.category_id || !activeCategories.some((c) => c.id === p.category_id);
  });

  const allSections = [
    ...grouped,
    ...(uncategorized.length > 0
      ? [{
          category: { id: "uncategorized", name: dict.common.more, slug: "more", description: null, sort_order: 999, is_active: true, created_at: "", updated_at: "" } as Category,
          items: uncategorized,
        }]
      : []),
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="relative py-20 bg-gradient-to-b from-brand/5 to-background">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 flex items-center justify-center mb-4">
              <Coffee className="w-8 h-8 text-brand" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              {dict.menuPage.title}
            </h1>
            <p className="text-muted mt-4 max-w-xl mx-auto">
              {dict.menuPage.subtitle}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto mt-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder={dict.menuPage.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-custom mt-16 space-y-20">
        <AnimatePresence mode="wait">
          {allSections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted text-lg">{dict.menuPage.noResults}</p>
            </motion.div>
          ) : (
            allSections.map(({ category, items }) => (
              <motion.section
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-10">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{category.name}</h2>
                  {category.description && (
                    <p className="text-muted mt-2 max-w-xl mx-auto">{category.description}</p>
                  )}
                  <div className="w-12 h-0.5 bg-brand mx-auto mt-3 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="group p-5 rounded-xl bg-card border border-border hover:border-brand/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5 hover:-translate-y-0.5 flex flex-col"
                    >
                      <div className="flex items-start justify-between gap-4 flex-1">
                        <div className="flex-1">
                          <h3 className="font-display text-base font-semibold text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted mt-1 leading-relaxed">{item.description}</p>
                        </div>
                        <span className="text-brand font-semibold text-sm whitespace-nowrap font-mono">{formatCurrency(item.price)}</span>
                      </div>
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => {
                            addItem(item);
                            toast.success(fmt(dict.cart.added, { name: item.name }));
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand/10 px-3 py-1.5 rounded-full"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {dict.common.addToCart}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
