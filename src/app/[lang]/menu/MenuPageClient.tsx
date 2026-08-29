"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Search, Plus, MessageCircle } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Product, Category } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import { formatCurrency, buildWhatsAppHref } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { fmt } from "@/lib/i18n/config";

interface MenuPageClientProps {
  products: Product[];
  categories: Category[];
  whatsappNumber: string;
}

export function MenuPageClient({ products, categories, whatsappNumber }: MenuPageClientProps) {
  const { addItem } = useCart();
  const { dict, link } = useI18n();
  const [search, setSearch] = useState("");

  const activeCategories = categories.filter((c) => c.is_active);

  // Sanity check: if duplicate product ids are present, warn to help root-cause tracing.
  const idCounts = new Map<string, number>();
  for (const p of products) idCounts.set(p.id, (idCounts.get(p.id) ?? 0) + 1);
  const dupIds = Array.from(idCounts.entries()).filter(([, c]) => c > 1).map(([id]) => id);
  if (dupIds.length > 0) {
    console.error("MenuPageClient: duplicate product ids present in products prop", { dupIds, total: products.length });
  }

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

  const buildItemWhatsAppHref = (item: Product) => {
    const price = `${Number(item.price ?? 0).toFixed(2)}`;
    const status = item.is_available ? dict.menuPage.available : dict.menuPage.notAvailable;
    const message = fmt(dict.whatsapp.order, { name: item.name, price, status });
    return buildWhatsAppHref(whatsappNumber, message);
  };

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="group p-4 rounded-xl bg-card border border-border hover:border-brand/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5 hover:-translate-y-0.5 flex flex-col overflow-hidden"
                    >
                      <Link href={link(`/product/${item.id}`)} className="block">
                        <div className="relative -mx-4 -mt-4 mb-3">
                  <div className="relative aspect-[4/3] w-full">
                    <ProductImage
                      src={item.image_url}
                      alt={item.name}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition group-hover:scale-[1.03]"
                    />
                            {!item.is_available && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full">
                                  {dict.menuPage.notAvailable}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start justify-between gap-4 flex-1">
                          <div className="flex-1">
                            <h3 className="font-display text-base font-semibold text-foreground group-hover:text-brand transition-colors">{item.name}</h3>
                            <p className="text-sm text-muted mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                          </div>
                          <span className="text-brand font-semibold text-sm whitespace-nowrap font-mono">{formatCurrency(item.price)}</span>
                        </div>
                      </Link>
                      <div className="flex items-center justify-end gap-2 mt-3">
                        <a
                          href={buildItemWhatsAppHref(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-disabled={!item.is_available}
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                            item.is_available
                              ? "bg-green-600/10 text-green-600 hover:bg-green-600 hover:text-white"
                              : "bg-muted/30 text-muted pointer-events-none opacity-50"
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {dict.menuPage.orderOnWhatsApp}
                        </a>
                        {item.is_available && (
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
                        )}
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
