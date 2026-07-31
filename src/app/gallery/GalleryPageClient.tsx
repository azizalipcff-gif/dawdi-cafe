"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";

const galleryImages = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `DAWDI Moment ${i + 1}`,
  category: ["Coffee", "Food", "Interior", "Team"][i % 4],
  span: i % 5 === 0 ? "md:col-span-2 md:row-span-2" : "",
}));

const categories = ["All", "Coffee", "Food", "Interior", "Team"];

export function GalleryPageClient() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeFilter === "All" ? galleryImages : galleryImages.filter((img) => img.category === activeFilter);

  return (
    <div className="pt-24">
      <section className="relative py-20 bg-gradient-to-b from-brand/5 to-background">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">Gallery</h1>
            <p className="text-muted mt-4 max-w-xl mx-auto">
              A visual journey through the DAWDI CAFE experience
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-custom">
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
                  className={`group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-brand/10 via-dark/10 to-brand/5 border border-border cursor-pointer ${image.span}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <p className="text-white font-semibold">{image.title}</p>
                    <p className="text-white/60 text-xs">{image.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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
              className="relative max-w-4xl w-full aspect-video rounded-2xl bg-gradient-to-br from-brand/20 via-dark to-brand/10 flex items-center justify-center border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageIcon className="w-32 h-32 text-white/20" />
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="text-white font-semibold text-lg">{galleryImages.find((img) => img.id === lightbox)?.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
