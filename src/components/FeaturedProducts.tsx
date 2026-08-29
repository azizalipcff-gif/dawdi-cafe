"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductImage } from "@/components/ProductImage";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const { link } = useI18n();
  if (!products || products.length === 0) return null;
  return (
    <section className="relative py-16 bg-gradient-to-b from-background to-white">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">Featured</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {products.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group p-4 rounded-xl bg-card border border-border hover:border-brand/20 transition-all">
              <Link href={link(`/product/${p.id}`)} className="block">
                <div className="relative aspect-[4/3] w-full mb-3">
                  <ProductImage src={p.image_url} alt={p.name} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">{p.name}</h3>
                    <p className="text-sm text-muted mt-1 truncate">{p.description}</p>
                  </div>
                  <span className="text-brand font-semibold text-sm whitespace-nowrap font-mono">{formatCurrency(Number(p.price))}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
