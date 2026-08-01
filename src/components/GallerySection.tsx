"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { GalleryItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";

interface GallerySectionProps {
  items: GalleryItem[];
  showLink?: boolean;
}

export function GallerySection({ items, showLink = true }: GallerySectionProps) {
  const { dict, link } = useI18n();
  const activeItems = items.filter((i) => i.is_active);
  const categories = [dict.common.all, ...Array.from(new Set(activeItems.map((i) => i.category ?? dict.common.other).filter(Boolean)))];
  const [activeFilter, setActiveFilter] = useState<string>(dict.common.all);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = activeFilter === dict.common.all ? activeItems : activeItems.filter((img) => (img.category ?? dict.common.other) === activeFilter);

  return (
    <section className="relative py-24 md:py-32 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">{dict.gallery.eyebrow}</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            {dict.gallery.title}
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            {dict.gallery.subtitle}
          </p>
        </motion.div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === cat
                    ? "bg-brand text-white shadow-lg shadow-brand/25"
                    : "bg-card text-foreground/70 hover:text-foreground border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-muted">{dict.gallery.empty}</p>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setLightbox(image.id)}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-border cursor-pointer bg-gray-100 dark:bg-gray-800"
                >
                  <Image
                    src={image.image_url}
                    alt={image.title ?? dict.gallery.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    {image.title && <p className="text-white font-semibold text-sm">{image.title}</p>}
                    {image.category && <p className="text-white/60 text-xs">{image.category}</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {showLink && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href={link("/gallery")}>
              <Button variant="outline" size="lg">
                {dict.gallery.viewAll}
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              key={lightbox}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-3xl w-full rounded-2xl overflow-hidden bg-dark flex items-center justify-center border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={activeItems.find((img) => img.id === lightbox)?.image_url ?? ""}
                  alt={dict.gallery.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 90vw, 48rem"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white font-semibold">{activeItems.find((img) => img.id === lightbox)?.title ?? ""}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
