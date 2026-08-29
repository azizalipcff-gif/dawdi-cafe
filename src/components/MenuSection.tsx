"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Product, Category } from "@/lib/types";
import { useCart } from "./CartProvider";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { fmt } from "@/lib/i18n/config";

interface MenuSectionProps {
  products: Product[];
  categories: Category[];
}

export function MenuSection({ products, categories }: MenuSectionProps) {
  const { addItem } = useCart();
  const { dict, link } = useI18n();
  const activeCategories = categories.filter((c) => c.is_active);
  const featuredProducts = products.filter((p) => p.is_available);

  const grouped = activeCategories
    .map((cat) => ({
      category: cat,
      items: featuredProducts.filter((p) => p.category_id === cat.id),
    }))
    .filter((g) => g.items.length > 0);

  const uncategorized = featuredProducts.filter((p) => !p.category_id || !activeCategories.some((c) => c.id === p.category_id));
  if (uncategorized.length > 0) {
    grouped.push({
      category: { id: "uncategorized", name: dict.common.more, slug: "more", description: null, image_url: null, sort_order: 999, is_active: true, created_at: "", updated_at: "" },
      items: uncategorized,
    });
  }

  const [activeCategory, setActiveCategory] = useState(grouped[0]?.category.name ?? dict.common.more);
  const active = grouped.find((g) => g.category.name === activeCategory) ?? grouped[0];

  return (
    <section className="relative py-24 md:py-32 bg-gray-50 dark:bg-dark/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">{dict.menuSection.eyebrow}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            {dict.menuSection.title}
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            {dict.menuSection.subtitle}
          </p>
        </motion.div>

        {grouped.length === 0 ? (
          <p className="text-center text-muted">{dict.menuSection.comingSoon}</p>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {grouped.map((g, i) => (
                <motion.button
                  key={g.category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setActiveCategory(g.category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === g.category.name
                      ? "bg-brand text-white shadow-lg shadow-brand/25"
                      : "bg-card text-foreground/70 hover:text-foreground border border-border hover:border-brand/30"
                  }`}
                >
                  {g.category.name}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
          <motion.div
            key={active?.category.id ?? "empty"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(active?.items ?? []).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-5 rounded-xl bg-card border border-border hover:border-brand/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5 flex flex-col"
                >
                  <Link href={link(`/product/${item.id}`)} className="flex items-start justify-between gap-4 flex-1">
                    <div className="flex-1">
                      <h4 className="font-display text-base font-semibold text-foreground group-hover:text-brand transition-colors">{item.name}</h4>
                      <p className="text-sm text-muted mt-1 leading-relaxed">{item.description}</p>
                    </div>
                    <span className="text-brand font-semibold text-sm whitespace-nowrap font-mono">{formatCurrency(item.price)}</span>
                  </Link>
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
              </motion.div>
            </AnimatePresence>
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href={link("/menu")}>
            <Button variant="outline" size="lg" className="gap-2">
              {dict.menuSection.viewFullMenu}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
