"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


const galleryImages = [
  { id: 1, title: "Coffee Art", category: "Coffee" },
  { id: 2, title: "Cozy Corner", category: "Interior" },
  { id: 3, title: "Fresh Crêpes", category: "Food" },
  { id: 4, title: "Espresso Shot", category: "Coffee" },
  { id: 5, title: "Outdoor Terrace", category: "Interior" },
  { id: 6, title: "Dessert Display", category: "Food" },
  { id: 7, title: "Barista at Work", category: "Team" },
  { id: 8, title: "Morning Brew", category: "Coffee" },
];

const categories = ["All", "Coffee", "Food", "Interior", "Team"];

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeFilter === "All" ? galleryImages : galleryImages.filter((img) => img.category === activeFilter);

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
          <span className="text-brand text-sm font-semibold tracking-widest uppercase">Gallery</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Visual Stories
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            A glimpse into the DAWDI world
          </p>
        </motion.div>

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
                className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-brand/10 via-dark/10 to-brand/5 border border-border cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  <p className="text-white font-semibold text-sm">{image.title}</p>
                  <p className="text-white/60 text-xs">{image.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/gallery">
            <Button variant="outline" size="lg">
              View All Photos
            </Button>
          </Link>
        </motion.div>
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
              className="relative max-w-3xl w-full aspect-video rounded-2xl bg-gradient-to-br from-brand/20 via-dark to-brand/10 flex items-center justify-center border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageIcon className="w-24 h-24 text-white/20" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white font-semibold">{galleryImages.find((img) => img.id === lightbox)?.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
