"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n/LocaleProvider";

interface GalleryPageClientProps {
  items: GalleryItem[];
}

export function GalleryPageClient({ items }: GalleryPageClientProps) {
  const { dict } = useI18n();
  const activeItems = items.filter((i) => i.is_active);
  const categories = [dict.common.all, ...Array.from(new Set(activeItems.map((i) => i.category ?? dict.common.other).filter(Boolean)))];
  const [activeFilter, setActiveFilter] = useState<string>(dict.common.all);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = activeFilter === dict.common.all ? activeItems : activeItems.filter((img) => (img.category ?? dict.common.other) === activeFilter);

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-gradient-to-b from-brand/5 to-background">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">{dict.galleryPage.metaTitle}</h1>
            <p className="text-muted mt-4 max-w-xl mx-auto">
              {dict.galleryPage.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-custom">
          {activeItems.length === 0 ? (
            <p className="text-center text-muted py-16">{dict.gallery.empty}</p>
          ) : (
            <>
              {categories.length > 1 && (
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
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

              <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
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
                        {image.title && <p className="text-white font-semibold">{image.title}</p>}
                        {image.category && <p className="text-white/60 text-xs">{image.category}</p>}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>

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
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              key={lightbox}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-dark flex items-center justify-center border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={activeItems.find((img) => img.id === lightbox)?.image_url ?? ""}
                  alt={dict.gallery.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 90vw, 56rem"
                />
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="text-white font-semibold text-lg">
                  {activeItems.find((img) => img.id === lightbox)?.title ?? ""}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
